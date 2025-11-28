import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Truck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Truck className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          LogiAI <span className="text-blue-500">Platform</span>
        </h1>
        <p className="text-xl text-slate-400">
          AI-powered logistics negotiation and sustainability tracking for the modern supply chain.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-8">
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
