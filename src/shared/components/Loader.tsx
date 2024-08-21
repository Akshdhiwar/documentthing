import { Loader as Load } from "lucide-react"


const Loader = () => {
    return (
        <div className="flex items-center justify-center h-full"><Load className="animate-spin"></Load></div>
    )
}

export default Loader