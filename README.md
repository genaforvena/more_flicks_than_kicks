# more_flicks_than_kicks
Here's a concise description and README for your project:

A minimalist, voice-controlled storytelling platform. Users can generate and listen to interactive stories with a single button press.

## Features
- Record your voice to start a story.
- Uses Groq's Llama API for story generation.
- Provides immediate narration with text-to-speech.

## Requirements
- Node.js
- A Groq API key
- A browser with microphone access

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your Groq API key as an environment variable:
   ```bash
   export GROQ_API_KEY=your_api_key
   ```

## Usage
1. Start the development server:
   ```bash
   npm start
   ```
2. Open the app in your browser.
3. Press the red record button to start interacting.

## GitHub Pages Deployment

To deploy this project to GitHub Pages, follow these steps:

1. Create a `gh-pages` branch in your repository:
   ```bash
   git checkout --orphan gh-pages
   git reset --hard
   git commit --allow-empty -m "Initialize gh-pages branch"
   git push origin gh-pages
   git checkout main
   ```

2. Add a GitHub Actions workflow file to automate the deployment process. Create a file at `.github/workflows/deploy.yml` with the following content:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout repository
           uses: actions/checkout@v2

         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Install dependencies
           run: npm install

         - name: Build project
           run: npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. Push your changes to the `gh-pages` branch:
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

4. Your project should now be deployed to GitHub Pages. You can access it at `https://<username>.github.io/<repository-name>/`.
