import Groq from 'groq-sdk';
import { Transcriptions } from './path-to-transcriptions-class';

const client = new Groq({
  apiKey: process.env['GROQ_API_KEY'],
});

const transcriptions = new Transcriptions();

const recordButton = document.getElementById('record-button');
let isRecording = false;
let storyContext = '';
let mediaRecorder;
let recordedChunks = [];

async function setupMediaRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
    recordedChunks = [];
    await processInput(audioBlob);
  };
}

async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-large-v3');
  formData.append('response_format', 'text');
  formData.append('language', 'en');

  try {
    const transcription = await transcriptions.create({
      file: formData.get('file'),
      model: 'whisper-large-v3',
      response_format: 'text',
      language: 'en',
    });
    return transcription.text;
  } catch (error) {
    console.error('Error during transcription:', error);
    return '';
  }
}

async function processInput(audioBlob) {
  const audioText = await transcribeAudio(audioBlob);
  if (!audioText) return;

  const prompt = `Please continue this story: ${storyContext} ${audioText}`;
  const response = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful storyteller.' },
      { role: 'user', content: prompt },
    ],
    model: 'llama3-8b-8192',
  });

  const storyContinuation = response.choices[0].message.content;
  storyContext += ` ${storyContinuation}`;
  narrateText(storyContinuation);
}

function narrateText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = () => console.log('TTS finished.');
  window.speechSynthesis.speak(utterance);
}

recordButton.addEventListener('click', async () => {
  if (!mediaRecorder) await setupMediaRecorder();

  if (!isRecording) {
    isRecording = true;
    recordButton.textContent = '🔴 Recording...';
    recordedChunks = [];
    mediaRecorder.start();
  } else {
    isRecording = false;
    recordButton.textContent = '🎙️';
    mediaRecorder.stop();
  }
});
