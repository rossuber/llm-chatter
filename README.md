# LLM Chatter, v0.0.1

Single HTML file interface to chat with Ollama local large language models (LLMs) or OpenAI.com LLMs.

![Application screenshot](https://github.com/rossuber/llm-chatter/blob/main/dist/screenshot.webp?raw=true)

# Installation
1. Install Ollama and [add at least one model](https://www.ollama.ai/library).
   - `curl https://ollama.ai/install.sh | sh`
   - `ollama run mistral-openorca:7b`
3. Run `wget https://raw.githubusercontent.com/rossuber/llm-chatter/master/dist/index.html`
4. Run `python3 -m http.server 8181`
5. Open `localhost:8181` in your web browser.
6. Optional: Register an account at [openai.com](https://openai.com/) and subscribe for an API key. Paste it into the 'Open AI' password field while OpenAI Chat is selected.

Built with: [Vite](https://vitejs.dev/) / [Bun](https://bun.sh/) / [React](https://react.dev/) / [TailwindCSS](https://tailwindcss.com/) / [FontAwesome](https://fontawesome.com/)

The web app pulls icon images from https://ka-f.fontawesome.com.

The web app makes API calls to http://localhost:11434 and https://api.openai.com.

[Ollama API docs](https://github.com/jmorganca/ollama/blob/main/docs/api.md)

[OpenAI API docs](https://platform.openai.com/docs/api-reference)

# Thank you
[Ollama.ai](https://www.ollama.ai/)

[OpenAI.com](https://www.openai.com/)
