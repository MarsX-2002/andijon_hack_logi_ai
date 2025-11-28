/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback, useRef } from 'react'

interface UseVoiceAgentProps {
    onMessage: (text: string) => void
    language?: 'en-US' | 'ru-RU' | 'uz-UZ'
}

export function useVoiceAgent({ onMessage, language = 'en-US' }: UseVoiceAgentProps) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)
    const onMessageRef = useRef(onMessage)

    // Keep ref up to date
    useEffect(() => {
        onMessageRef.current = onMessage
    }, [onMessage])

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-expect-error - webkitSpeechRecognition is not in standard types
            const recognition = new window.webkitSpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false
            recognition.lang = language // Use selected language

            recognition.onstart = () => setIsListening(true)
            recognition.onend = () => setIsListening(false)
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                onMessageRef.current(transcript)
            }

            setRecognition(recognition)
        }
    }, [language]) // Re-create when language changes

    const speak = useCallback(async (text: string, lang: 'en-US' | 'ru-RU' | 'uz-UZ' = 'en-US') => {
        // Stop listening while speaking to prevent echo
        if (recognition) recognition.stop()

        setIsSpeaking(true)

        try {
            // Try ElevenLabs first (premium quality)
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language: lang })
            })

            if (response.ok) {
                const { audio } = await response.json()

                // Play audio
                const audioBlob = new Blob(
                    [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
                    { type: 'audio/mpeg' }
                )
                const audioUrl = URL.createObjectURL(audioBlob)
                const audioElement = new Audio(audioUrl)

                audioElement.onended = () => {
                    setIsSpeaking(false)
                    URL.revokeObjectURL(audioUrl)
                }

                await audioElement.play()
            } else {
                // Fallback to browser TTS if ElevenLabs/Muxlisa fails
                console.warn('TTS API unavailable, using browser TTS')
                fallbackToBrowserTTS(text, lang)
            }
        } catch (error) {
            console.error('TTS Error:', error)
            // Fallback to browser TTS
            fallbackToBrowserTTS(text, lang)
        }
    }, [recognition])

    // Browser TTS fallback
    const fallbackToBrowserTTS = (text: string, lang: 'en-US' | 'ru-RU' | 'uz-UZ') => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = lang
            utterance.onend = () => {
                setIsSpeaking(false)
            }
            window.speechSynthesis.speak(utterance)
        }
    }

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.start()
            } catch (e) {
                console.error("Speech recognition already started")
            }
        }
    }, [recognition])

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop()
        }
    }, [recognition])

    return {
        isListening,
        isSpeaking,
        startListening,
        stopListening,
        speak
    }
}
