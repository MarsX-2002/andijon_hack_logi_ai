export interface Freight {
    id: string;
    origin: string;
    destination: string;
    weight: number; // in tons
    price: number; // in USD
    commodity: string;
    pickupDate: string;
    status: 'open' | 'negotiating' | 'booked' | 'delivered';
    brokerId: string;
    co2Saved?: number; // in kg
}

export interface Broker {
    id: string;
    name: string;
    company: string;
    phone: string;
    rating: number;
}

export interface Dispatcher {
    id: string;
    name: string;
    company: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}
