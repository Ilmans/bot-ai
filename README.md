#Whatsapp Bot Integrate with Open AI

# This script webhook is must be integrated with whatsapp gateway m pedia ( m-pedia.co.id )

[![preview](https://youtu.be/lMoCF_fvewA)](https://youtu.be/lMoCF_fvewA)

Feature :

- create sticker from image with /sticker command
- Chatting with ai by gemini or openai ( generative chatting )

## Installation

To get started, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Ilmans/bot-ai.git
   cd bot-ai
   ```

   2. **Rename and configure `.env` file**:

   - Rename `.env.example` to `.env`.
   - Fill in your `gemini_key` or `openai_key`.
   - Set `bot_active` to either `gemini` or `openai` based on the AI service you want to use.

2. **Install dependencies and start the bot**:

   ```bash
   npm install
   npm run start
   ```

then input the url http://url:port/bot to your whatsapp gateway m pedia webhook form.
