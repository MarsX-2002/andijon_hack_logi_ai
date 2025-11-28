"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_FREIGHTS } from '@/lib/data'
import { Freight } from '@/types'

interface FreightContextType {
    freights: Freight[]
    addFreight: (freight: Freight) => void
    updateFreight: (id: string, updates: Partial<Freight>) => void
}

const FreightContext = createContext<FreightContextType | undefined>(undefined)

export function FreightProvider({ children }: { children: React.ReactNode }) {
    const [freights, setFreights] = useState<Freight[]>([])

    useEffect(() => {
        // Load from localStorage or fall back to MOCK_FREIGHTS
        const saved = localStorage.getItem('freights')
        if (saved) {
            setFreights(JSON.parse(saved))
        } else {
            setFreights(MOCK_FREIGHTS)
        }
    }, [])

    const addFreight = (newFreight: Freight) => {
        setFreights(prev => {
            const updated = [newFreight, ...prev]
            localStorage.setItem('freights', JSON.stringify(updated))
            return updated
        })
    }

    const updateFreight = (id: string, updates: Partial<Freight>) => {
        setFreights(prev => {
            const updated = prev.map(f => f.id === id ? { ...f, ...updates } : f)
            localStorage.setItem('freights', JSON.stringify(updated))
            return updated
        })
    }

    return (
        <FreightContext.Provider value={{ freights, addFreight, updateFreight }}>
            {children}
        </FreightContext.Provider>
    )
}

export function useFreight() {
    const context = useContext(FreightContext)
    if (context === undefined) {
        throw new Error('useFreight must be used within a FreightProvider')
    }
    return context
}
