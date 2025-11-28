import { Freight, Broker } from '@/types';
import { calculateCO2Savings } from './cities';

const CITIES_UZ = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Nukus'];
const CITIES_RU = ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Chelyabinsk'];
const COMMODITIES = ['Textiles', 'Fruits', 'Vegetables', 'Cotton', 'Machinery', 'Electronics'];

export const MOCK_BROKERS: Broker[] = [
    { id: 'b1', name: 'Aziz Rakhimov', company: 'Silk Road Logistics', phone: '+998901234567', rating: 4.8 },
    { id: 'b2', name: 'Ivan Petrov', company: 'TransSiberia Cargo', phone: '+79991234567', rating: 4.5 },
    { id: 'b3', name: 'Dilshod Aliev', company: 'Andijan Express', phone: '+998919876543', rating: 4.9 },
];

export function generateMockFreights(count: number = 10): Freight[] {
    return Array.from({ length: count }).map((_, i) => {
        const isExport = Math.random() > 0.5;
        const origin = isExport
            ? CITIES_UZ[Math.floor(Math.random() * CITIES_UZ.length)]
            : CITIES_RU[Math.floor(Math.random() * CITIES_RU.length)];
        const destination = isExport
            ? CITIES_RU[Math.floor(Math.random() * CITIES_RU.length)]
            : CITIES_UZ[Math.floor(Math.random() * CITIES_UZ.length)];

        const weight = Math.floor(Math.random() * 20) + 1; // 1-21 tons
        const priceBase = 1000 + (weight * 100) + (Math.random() * 500);

        return {
            id: `f${i + 1}`,
            origin,
            destination,
            weight,
            price: Math.floor(priceBase),
            commodity: COMMODITIES[Math.floor(Math.random() * COMMODITIES.length)],
            pickupDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'open',
            brokerId: MOCK_BROKERS[Math.floor(Math.random() * MOCK_BROKERS.length)].id,
            co2Saved: calculateCO2Savings(origin, destination, weight), // Real calculation!
        };
    });
}

export const MOCK_FREIGHTS = generateMockFreights(15);
