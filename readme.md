# Load web URL data with EmbedJS for RAG

This repo serves to help you get started with the EmbedJS library (`@llm-tools/embedjs`) for implementing RAG in your own Node.js applications.

In particular, this example shows how to use multiple web URLs as the context for the RAG model.

The script follows this flow, which you can see in `main()`:

1. Initializes the RAG model (`getRagApplication()`)
1. Loads the content of multiple URLs (`loadResources()`)
1. Takes a prompt from the command line (`getPrompt()`)
1. Prompts the RAG model with the prompt and the loaded resources (`promptRag()`)
1. Prints the response from the RAG model (`printRagOutput()`)

## Requirements

- Node.js 20+
- npm 10+
- An OpenAI API key

## Install

Install the repo and its dependencies like this:

```bash
git clone REPO_URL
cd REPO_NAME
npm install
```

## Configure

Create a new file called `.env`:

```bash
touch .env
```

In your new `.env` file, add a variable for your OpenAI API key and add your key:

```text
OPENAI_API_KEY=your_key_here
```

## Usage

You can run the script with or without prompt as a command line argument:

```bash
npm start # No prompt (the script has a default)
npm start "What exercise meetups are happening in Berlin?"
```

The output will print in your terminal.
