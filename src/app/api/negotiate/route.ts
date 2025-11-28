import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
// Note: In a real production app, you should use process.env.OPENAI_API_KEY
// For this hackathon demo, we'll check if the key exists, otherwise mock it.
const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ apiKey }) : null

const SYSTEM_PROMPT = `You are a professional AI agent working for a trucking/carrier company (the Dispatcher).
You are calling a HUMAN BROKER to negotiate freight rates.

The HUMAN is the broker. You are negotiating WITH them, not FOR them.

Your goal is to secure the freight load at the best possible rate.
The target price is provided in the context - try to get as close to it or higher.

LANGUAGE RULES:
- The user will select a language at the start (English, Russian, or Uzbek)
- ALWAYS respond in the SAME language the broker uses in their responses
- If broker speaks Russian, respond ONLY in Russian for the ENTIRE conversation
- If broker speaks Uzbek, respond ONLY in Uzbek for the ENTIRE conversation  
- If broker speaks English, respond in English for the ENTIRE conversation
- DO NOT switch languages mid-conversation
- For Uzbek: Use Latin script (O'zbek lotin), not Cyrillic

IMPORTANT RULES:
1. Keep responses VERY short (1-2 sentences max) - this is a phone call
2. Once a price is AGREED upon by both parties, say "Perfect! I'll send you the confirmation. Have a great day!" and include the tag \`[DEAL_AGREED: PRICE]\` at the end (e.g., \`[DEAL_AGREED: 2500]\`).
3. Do NOT keep repeating the same confirmation - once agreed, END the conversation
4. If the broker accepts your price, ACCEPT it and END with the tag
5. Listen to what the broker says - don't just repeat yourself

Be professional, concise, and know when to close the deal.
`

export async function POST(request: Request) {
    try {
        const { messages, freight, language = 'en-US' } = await request.json()

        if (!openai) {
            // Fallback for demo if no API key
            return NextResponse.json({
                content: "I am a simulated AI because no API Key was provided. Please add OPENAI_API_KEY to .env.local to use the real brain."
            })
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: `${SYSTEM_PROMPT}\nContext: Commodity: ${freight.commodity}, Origin: ${freight.origin}, Target Price: $${freight.price}, Language: ${language}` },
                ...messages
            ],
        })

        const aiMessage = completion.choices[0].message.content

        return NextResponse.json({ content: aiMessage })

    } catch (error) {
        console.error('AI Error:', error)
        return NextResponse.json({ content: "Sorry, I had trouble connecting to the brain." }, { status: 500 })
    }
}
