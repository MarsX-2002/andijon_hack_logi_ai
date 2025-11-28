import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { text, language } = await request.json()

        // Use Muxlisa for Uzbek (native support)
        if (language === 'uz-UZ') {
            try {
                return await generateMuxlisaAudio(text)
            } catch (error) {
                console.warn('Muxlisa failed for Uzbek, will use browser TTS fallback:', error)
                return NextResponse.json({
                    error: 'Muxlisa unavailable',
                    fallbackToBrowser: true
                }, { status: 503 })
            }
        }

        // Use ElevenLabs for English and Russian
        try {
            return await generateElevenLabsAudio(text, language)
        } catch (error) {
            console.warn('ElevenLabs failed, will use browser TTS fallback:', error)
            return NextResponse.json({
                error: 'ElevenLabs unavailable',
                fallbackToBrowser: true
            }, { status: 503 })
        }

    } catch (error) {
        console.error('TTS Error:', error)
        return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
    }
}

// Muxlisa.uz for Uzbek
async function generateMuxlisaAudio(text: string) {
    const apiKey = process.env.MUXLISAI_API_KEY

    if (!apiKey) {
        throw new Error('Muxlisa API key not configured')
    }

    const response = await fetch('https://service.muxlisa.uz/api/v2/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({
            text: text,
            speaker: 1 // 1 = Male (default), 0 = Female
        })
    })

    if (!response.ok) {
        throw new Error(`Muxlisa API error: ${response.statusText}`)
    }

    // Muxlisa returns binary WAV data
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
        audio: base64Audio,
        contentType: 'audio/wav' // Note: Muxlisa returns WAV
    })
}

// ElevenLabs for English and Russian
async function generateElevenLabsAudio(text: string, language: string) {
    const apiKey = process.env.ELEVENLABS_API_KEY

    // Debug log (masked)
    console.log('ElevenLabs Key loaded:', apiKey ? `${apiKey.substring(0, 4)}...` : 'MISSING')

    if (!apiKey) {
        return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 })
    }

    // Voice IDs - using Adam for consistency
    const voiceIds: Record<string, string> = {
        'en-US': 'pNInz6obpgDQGcFmaJgB', // Adam - Deep male English voice
        'ru-RU': 'pNInz6obpgDQGcFmaJgB', // Adam works well for Russian too
    }

    const voiceId = voiceIds[language] || voiceIds['en-US']

    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
        audio: base64Audio,
        contentType: 'audio/mpeg'
    })
}
