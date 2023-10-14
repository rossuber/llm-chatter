# LLM Chatter, v0.0.1

Single HTML file interface to chat with Ollama local large language models (LLMs) or OpenAI.com LLMs.

![Application screenshot](https://github.com/rossuber/llm-chatter/blob/main/dist/screenshot.webp?raw=true)

# Installation
1. Install Ollama and [add at least one model](https://www.ollama.ai/library).
2. Run `wget https://raw.githubusercontent.com/rossuber/llm-chatter/master/dist/index.html`
3. Run `python3 -m http.server 8181`
4. Open `localhost:8181` in your web browser.
5. Optional: Register an account at [openai.com](https://openai.com/) and subscribe for an API key. Paste it into the 'Open AI' password field while OpenAI Chat is selected.

Built with: Vite / Bun / React / TailwindJSS / FontAwesome

The web app pulls icon images from https://ka-f.fontawesome.com.

The web app makes API calls to http://localhost:11434 and https://api.openai.com.

# Thank you
[Ollama.ai](https://www.ollama.ai/)
