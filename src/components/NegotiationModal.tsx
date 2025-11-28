"use client"

import { useState } from 'react'
import { Freight, Message } from '@/types'
// Removed unused Headless UI import
import { Mic, MicOff, X, Phone } from 'lucide-react'
import { useFreight } from '@/context/FreightContext'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface NegotiationModalProps {
    freight: Freight
    isOpen: boolean
    onClose: () => void
}

import { useVoiceAgent } from '@/hooks/useVoiceAgent'

export function NegotiationModal({ freight, isOpen, onClose }: NegotiationModalProps) {
    const [isCallActive, setIsCallActive] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [language, setLanguage] = useState<'en-US' | 'ru-RU' | 'uz-UZ'>('en-US')

    const handleUserMessage = async (text: string) => {
        const userMessage: Message = {
            id: Math.random().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now()
        }

        // Add user message to state
        setMessages(prev => [...prev, userMessage])

        // Call AI with updated messages (not inside setState to avoid double-call in strict mode)
        const updatedMessages = [...messages, userMessage]
        callAI(updatedMessages)
    }

    const callAI = async (currentMessages: Message[]) => {
        try {
            const response = await fetch('/api/negotiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: currentMessages,
                    freight,
                    language // Send selected language to API
                })
            })

            const data = await response.json()
            let aiText = data.content

            // Check for field updates
            const updateMatch = aiText.match(/\[UPDATE:\s*(\w+)=([^\]]+)\]/)
            if (updateMatch) {
                const [, field, value] = updateMatch
                // Remove tag from spoken text
                aiText = aiText.replace(/\[UPDATE:\s*\w+=[^\]]+\]/, '').trim()

                // Update freight detail
                updateFreight(freight.id, {
                    [field]: value
                })
            }

            // Check for deal agreement tag
            // Regex handles: [DEAL_AGREED: 2500], [DEAL_AGREED: $2500], [DEAL_AGREED:2500]
            const dealMatch = aiText.match(/\[DEAL_AGREED:\s*\$?([\d,]+)\]/)
            if (dealMatch) {
                // Remove commas if present (e.g. 2,500)
                const agreedPrice = parseInt(dealMatch[1].replace(/,/g, ''))
                // Remove tag from spoken text
                aiText = aiText.replace(/\[DEAL_AGREED:[^\]]+\]/, '').trim()

                // Update freight status and save logs
                updateFreight(freight.id, {
                    price: agreedPrice,
                    status: 'booked',
                    logs: [...messages, { role: 'assistant', content: aiText, id: Math.random().toString(), timestamp: Date.now() }],
                    originalPrice: freight.originalPrice || freight.price, // Save original price if not set
                })

                // Close modal after a delay (allow AI to say goodbye)
                setTimeout(() => {
                    onClose()
                }, 5000)
            }

            addMessage('assistant', aiText)
            speak(aiText, language) // Speak in selected language

            // Check if conversation is ending
            const endPhrases = ['have a great day', 'have a good day', 'thank you for the agreement', "i'll send you the confirmation"]
            if (endPhrases.some(phrase => aiText.toLowerCase().includes(phrase))) {
                // Stop listening - conversation is over
                setTimeout(() => {
                    stopListening()
                }, 3000)
            }

        } catch (error) {
            console.error("Failed to get AI response", error)
            const fallback = "I'm having trouble connecting. Let's agree on the price manually."
            addMessage('assistant', fallback)
            speak(fallback, language)
        }
    }

    const { isListening, isSpeaking, startListening, stopListening, speak } = useVoiceAgent({
        onMessage: handleUserMessage,
        language
    })

    const { updateFreight } = useFreight()

    const startCall = () => {
        setIsCallActive(true)
        setMessages([]) // Clear previous messages
        // Simulate connection delay
        setTimeout(() => {
            // Greeting in selected language
            const greetings = {
                'en-US': `Hello! I am calling about the ${freight.commodity} load from ${freight.origin}. Is it still available?`,
                'ru-RU': `Здравствуйте! Я звоню по поводу груза "${freight.commodity}" из ${freight.origin}. Он всё ещё доступен?`,
                'uz-UZ': `Salom! Men ${freight.origin}dan "${freight.commodity}" yuki haqida qo'ng'iroq qilyapman. U hali mavjudmi?`
            }
            const greeting = greetings[language] || greetings['en-US']
            addMessage('assistant', greeting)
            speak(greeting, language)
            // User will click microphone to respond - prevents echo
        }, 1500)
    }

    const addMessage = (role: 'user' | 'assistant', content: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            role,
            content,
            timestamp: Date.now()
        }])
    }

    const endCall = () => {
        setIsCallActive(false)
        setMessages([])
        stopListening()
        window.speechSynthesis.cancel()
        onClose()
    }

    const toggleListening = () => {
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-lg">AI Broker Agent</h2>
                        <p className="text-xs text-slate-400">Calling Broker...</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-800">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Call Interface */}
                <div className="h-[400px] bg-slate-50 flex flex-col relative">
                    {!isCallActive ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                                <Phone className="w-10 h-10 text-blue-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-800">Ready to Call</h3>
                                <p className="text-slate-500">Broker: {freight.brokerId}</p>
                            </div>

                            {/* Language Selector */}
                            <div className="w-full max-w-xs space-y-2">
                                <label className="text-sm font-medium text-slate-600">Select Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as 'en-US' | 'ru-RU' | 'uz-UZ')}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                                >
                                    <option value="en-US">🇺🇸 English</option>
                                    <option value="ru-RU">🇷🇺 Русский (Russian)</option>
                                    <option value="uz-UZ">🇺🇿 O&apos;zbek (Uzbek)</option>
                                </select>
                                <p className="text-sm text-slate-600">AI&apos;s auto-detect works best when you speak clearly.</p>
                            </div>

                            <Button size="lg" className="bg-green-500 hover:bg-green-600 rounded-full px-8" onClick={startCall}>
                                Start Negotiation
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Conversation History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-blue-500 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isSpeaking && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full animate-pulse">
                                            AI is speaking...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="p-4 bg-white border-t flex flex-col items-center gap-3">
                                <div className="text-xs text-slate-500 text-center">
                                    {isListening ? '🎤 Listening...' : '👇 Click mic to speak'}
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        variant={isListening ? "destructive" : "default"}
                                        size="icon"
                                        className={`rounded-full w-14 h-14 ${isListening ? 'animate-pulse ring-4 ring-red-200 bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                                        onClick={toggleListening}
                                        disabled={isSpeaking}
                                    >
                                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="rounded-full w-12 h-12"
                                        onClick={endCall}
                                    >
                                        <Phone className="w-5 h-5 rotate-[135deg]" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
