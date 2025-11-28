import { Truck, LayoutDashboard, Settings, LogOut, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Truck className="text-blue-500" />
                        <span>LogiAI</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dispatcher</span>
                    </Link>
                    <Link href="/broker" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        <span>Broker Portal</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-slate-800">Freight Dispatcher</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            JD
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
