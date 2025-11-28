// City coordinates for distance calculation
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    // Uzbekistan
    'Tashkent': { lat: 41.2995, lng: 69.2401 },
    'Samarkand': { lat: 39.6270, lng: 66.9750 },
    'Bukhara': { lat: 39.7681, lng: 64.4556 },
    'Andijan': { lat: 40.7821, lng: 72.3442 },
    'Namangan': { lat: 40.9983, lng: 71.6726 },
    'Fergana': { lat: 40.3842, lng: 71.7843 },
    'Nukus': { lat: 42.4531, lng: 59.6103 },

    // Russia
    'Moscow': { lat: 55.7558, lng: 37.6173 },
    'Saint Petersburg': { lat: 59.9343, lng: 30.3351 },
    'Novosibirsk': { lat: 55.0084, lng: 82.9357 },
    'Yekaterinburg': { lat: 56.8389, lng: 60.6057 },
    'Kazan': { lat: 55.7961, lng: 49.1064 },
    'Chelyabinsk': { lat: 55.1644, lng: 61.4368 },

    // Kazakhstan
    'Almaty': { lat: 43.2220, lng: 76.8512 },
    'Astana': { lat: 51.1694, lng: 71.4491 },

    // Kyrgyzstan
    'Bishkek': { lat: 42.8746, lng: 74.5698 },

    // Tajikistan
    'Dushanbe': { lat: 38.5598, lng: 68.7870 }
}

/**
 * Calculate distance between two cities using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(city1: string, city2: string): number {
    const coord1 = CITY_COORDS[city1]
    const coord2 = CITY_COORDS[city2]

    if (!coord1 || !coord2) {
        console.warn(`Unknown city: ${city1} or ${city2}, using average distance`)
        return 2000 // Default estimate for missing cities
    }

    const R = 6371 // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat)
    const dLng = toRad(coord2.lng - coord1.lng)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

/**
 * Calculate CO2 savings for rail vs truck transport
 * Emission factors (kg CO2 per ton-km):
 * - Rail: 0.022
 * - Truck: 0.062
 * Savings = (truck - rail) × distance × weight
 */
export function calculateCO2Savings(origin: string, destination: string, weightTons: number): number {
    const distance = calculateDistance(origin, destination)
    const TRUCK_EMISSION = 0.062 // kg CO2 per ton-km
    const RAIL_EMISSION = 0.022 // kg CO2 per ton-km

    const savings = (TRUCK_EMISSION - RAIL_EMISSION) * distance * weightTons
    return Math.floor(savings)
}
