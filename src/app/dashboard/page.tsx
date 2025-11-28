"use client"

import { FreightList } from '@/components/FreightList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useFreight } from '@/context/FreightContext'

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
})

export default function DashboardPage() {
    const { freights } = useFreight()

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content - Freight List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-slate-800">Available Loads</h1>
                        <div className="flex gap-2">
                            <span className="text-sm text-slate-500">Sort by:</span>
                            <select className="text-sm border rounded px-2 py-1 bg-white">
                                <option>Newest First</option>
                                <option>Highest Price</option>
                                <option>Lowest CO2</option>
                            </select>
                        </div>
                    </div>

                    <FreightList />
                </div>

                {/* Sidebar - Map & Stats */}
                <div className="space-y-6">
                    {/* Map Widget */}
                    <Card className="overflow-hidden border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b p-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Live Route Map
                            </CardTitle>
                        </CardHeader>
                        <div className="h-[300px] bg-slate-100 relative">
                            <Map freights={freights} />
                        </div>
                    </Card>

                    {/* Eco Impact Widget */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Leaf className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-green-900">Eco Impact</h3>
                                    <p className="text-slate-600">Here&apos;s an overview of your current logistics operations.</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">CO2 Saved</span>
                                    <span className="font-bold text-green-700">2,450 kg</span>
                                </div>
                                <div className="w-full bg-green-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    You are in the top 5% of eco-friendly dispatchers this month!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
