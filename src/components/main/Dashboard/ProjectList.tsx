import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"


const ProjectList = () => {
  return (
    <div className="p-5">
        <div className="flex gap-2">
            <Button size={"sm"} className="flex items-center justify-center gap-1"><Plus height={18} width={18}></Plus> <p>New Project</p></Button>
            <Button size={"sm"} variant={"outline"}>New Organization</Button>
            <div className="relative">
                <Input className="pl-8 h-[30px]"></Input>
                <Search height={18} width={18} className="absolute top-[5px] left-2 text-slate-400"></Search>
            </div>
        </div>
        <div className="space-y-2">
            
        </div>
    </div>
  )
}

export default ProjectList