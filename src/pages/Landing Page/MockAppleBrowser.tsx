import { ChevronLeft, ChevronRight, Plus, RotateCcw, Share2, ShieldCheck, CircleArrowDown } from 'lucide-react'

export default function MockAppleBrowser() {
    return (
        <div className="w-full max-w-[1500px] mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            {/* Title Bar */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-2.5 flex items-center gap-6 border-b border-gray-200">
                {/* Traffic Lights */}
                <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    {/* Navigation */}
                    <div className="md:flex gap-1 hidden">
                        <button className="p-1 hover:bg-gray-200 rounded">
                            <ChevronLeft size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                            <ChevronRight size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>



                {/* URL Bar */}
                <div className="flex-grow">
                    <div className="bg-gray-100 rounded-lg px-3 py-1 flex items-center justify-between gap-2 border border-transparent hover:border-gray-300">
                        <ShieldCheck size={16} className="text-gray-400"></ShieldCheck>
                        <span className="text-gray-600 text-sm">documentthing.com</span>
                        {/* Utility Icons */}
                        <button className="p-1 hover:bg-gray-200 rounded">
                            <RotateCcw size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <button className="p-1 hover:bg-gray-200 rounded hidden md:block">
                        <CircleArrowDown size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded hidden md:block">
                        <Share2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <Plus size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>
            <div>
                <img src="./main.png" alt="" className='w-full' />
            </div>
        </div>
    )
}

