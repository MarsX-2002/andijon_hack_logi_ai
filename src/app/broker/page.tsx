"use client"

import { PostLoadForm } from '@/components/PostLoadForm'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useFreight } from '@/context/FreightContext'

export default function BrokerPage() {
    const { freights } = useFreight()
    // Filter mock freights to show "My Loads" (just taking first 3 for demo)
    const myLoads = freights.slice(0, 3)

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Broker Portal</h1>
                <div className="text-sm text-slate-500">Welcome, Aziz Rakhimov</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Post New Load */}
                <div className="lg:col-span-2">
                    <PostLoadForm />
                </div>

                {/* Right: My Active Loads */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">My Active Loads</h2>
                    {myLoads.map((load) => (
                        <Card key={load.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline">{load.status}</Badge>
                                    <span className="font-bold text-blue-600">${load.price}</span>
                                </div>
                                <h3 className="font-medium">{load.commodity}</h3>
                                <p className="text-sm text-slate-500">{load.origin} → {load.destination}</p>
                                <div className="mt-2 text-xs text-slate-400">Posted: Today</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
