"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, MapPin, Calendar, DollarSign } from 'lucide-react'
import { useFreight } from '@/context/FreightContext'
import { Freight } from '@/types'

export function PostLoadForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { addFreight } = useFreight()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Create new freight object from form data (mocking form extraction for speed)
        // In a real app, we'd use controlled inputs or FormData
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const newFreight: Freight = {
            id: Math.random().toString(36).substr(2, 9),
            origin: formData.get('origin') as string || 'Tashkent', // Fallback for demo
            destination: formData.get('destination') as string || 'Moscow',
            commodity: formData.get('commodity') as string || 'General',
            weight: Number(formData.get('weight')) || 10,
            price: Number(formData.get('price')) || 1000,
            pickupDate: (formData.get('pickupDate') as string) || new Date().toISOString().split('T')[0],
            status: 'open',
            brokerId: 'b1',
            co2Saved: Math.floor(Math.random() * 200)
        }

        setTimeout(() => {
            addFreight(newFreight)
            setIsLoading(false)
            alert("Load posted successfully!")
            form.reset()
        }, 1000)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Post New Freight
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Origin</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="City, Country"
                                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="destination"
                                    placeholder="City, Country"
                                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Commodity</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="commodity"
                                    placeholder="e.g. Textiles"
                                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Weight (Tons)</label>
                            <input
                                type="number"
                                name="weight"
                                placeholder="20"
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pickup Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    name="pickupDate"
                                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Price (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="1500"
                                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? 'Posting...' : 'Post Load'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
