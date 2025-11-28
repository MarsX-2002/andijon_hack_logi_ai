"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Freight } from '@/types'
import L from 'leaflet'

// Fix for default marker icon in Next.js/Leaflet
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface MapProps {
    freights: Freight[]
}

// Approximate coordinates for demo
const CITY_COORDS: Record<string, [number, number]> = {
    'Tashkent': [41.2995, 69.2401],
    'Samarkand': [39.6270, 66.9750],
    'Bukhara': [39.7681, 64.4556],
    'Andijan': [40.7821, 72.3442],
    'Fergana': [40.3842, 71.7843],
    'Namangan': [40.9983, 71.6726],
    'Moscow': [55.7558, 37.6173],
    'Saint Petersburg': [59.9343, 30.3351],
    'Kazan': [55.7961, 49.1064],
    'Novosibirsk': [55.0084, 82.9357],
    'Yekaterinburg': [56.8389, 60.6057],
    'Almaty': [43.2220, 76.8512],
    'Astana': [51.1694, 71.4491],
    'Bishkek': [42.8746, 74.5698],
    'Dushanbe': [38.5598, 68.7870]
}

export default function Map({ freights }: MapProps) {
    return (
        <MapContainer center={[41.2995, 69.2401]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {freights.map((freight) => {
                const coords = CITY_COORDS[freight.origin] || [41.2995, 69.2401]
                return (
                    <Marker key={freight.id} position={coords} icon={icon}>
                        <Popup>
                            <div className="text-sm">
                                <p className="font-bold">{freight.commodity}</p>
                                <p>From: {freight.origin}</p>
                                <p>To: {freight.destination}</p>
                                <p>Price: ${freight.price}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    )
}
