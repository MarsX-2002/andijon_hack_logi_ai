"use client"

import { useState } from 'react'
import { useFreight } from '@/context/FreightContext'
import { Freight } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, Truck, Leaf, Filter } from 'lucide-react'
import { NegotiationModal } from './NegotiationModal'
import { motion } from 'framer-motion'

export function FreightList() {
    const { freights } = useFreight()
    const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null)
    const [filter, setFilter] = useState({ minPrice: 0, maxPrice: 100000, minWeight: 0 })
    const [expandedCard, setExpandedCard] = useState<string | null>(null)

    const filteredFreights = freights.filter(f =>
        f.price >= filter.minPrice &&
        f.price <= filter.maxPrice &&
        f.weight >= filter.minWeight
    )

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 flex gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Min Price ($)</label>
                        <input
                            type="number"
                            className="w-24 h-8 rounded border px-2 text-sm text-slate-900 bg-white"
                            value={filter.minPrice}
                            onChange={(e) => setFilter(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Min Weight (t)</label>
                        <input
                            type="number"
                            className="w-24 h-8 rounded border px-2 text-sm text-slate-900 bg-white"
                            value={filter.minWeight}
                            onChange={(e) => setFilter(prev => ({ ...prev, minWeight: Number(e.target.value) }))}
                        />
                    </div>
                    <div className="flex-1"></div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Filter className="w-4 h-4" />
                        {filteredFreights.length} results
                    </div>
                </CardContent>
            </Card>

            {/* Freight List */}
            {filteredFreights.map((freight) => {
                const isExpanded = expandedCard === freight.id
                return (
                    <Card
                        key={freight.id}
                        className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500 bg-white"
                        onClick={() => setExpandedCard(isExpanded ? null : freight.id)}
                    >
                        <CardContent className="p-4">
                            {/* Always Visible Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        <span className="font-semibold text-slate-800">
                                            {freight.origin} → {freight.destination}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Truck className="w-4 h-4" />
                                            {freight.weight}t
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {freight.commodity}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-900">${freight.price.toLocaleString()}</div>
                                    <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">
                                        <Leaf className="w-3 h-3 mr-1" />
                                        {freight.co2Saved} kg CO₂
                                    </Badge>
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 pt-4 border-t space-y-3"
                                >
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-slate-700 font-medium">Pickup Date:</span>
                                            <span className="ml-2 font-medium text-slate-900">{freight.pickupDate}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-700 font-medium">Status:</span>
                                            <Badge className="ml-2" variant="outline">{freight.status}</Badge>
                                        </div>
                                        <div>
                                            <span className="text-slate-700 font-medium">Broker ID:</span>
                                            <span className="ml-2 font-medium text-slate-900">{freight.brokerId}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-blue-500 hover:bg-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedFreight(freight)
                                        }}
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        AI Negotiate
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}

            {selectedFreight && (
                <NegotiationModal
                    freight={selectedFreight}
                    isOpen={!!selectedFreight}
                    onClose={() => setSelectedFreight(null)}
                />
            )}
        </div>
    )
}
