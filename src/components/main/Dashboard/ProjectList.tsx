import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, Plus, Search } from "lucide-react"


const ProjectList = () => {
  return (
    <div className="p-5">
      <div className="flex gap-2 items-center justify-between">
        <div className="relative">
          <Input className="pl-8 h-[32px]"></Input>
          <Search height={18} width={18} className="absolute top-[7px] left-2 text-slate-400"></Search>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} className=" h-[32px]">New Organization</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center gap-1  h-[32px]"><Plus height={18} width={18}></Plus> <p>New Project</p></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create new project</DialogTitle>
                <DialogDescription>
                  Enter the name for your new project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="my-6">
        <ul className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="w-full group relative h-44 border rounded-md hover:cursor-pointer p-4 transition-all hover:bg-primary/10">
            <p className="truncate mr-6 text-sm">React Shopping App</p>
            <ChevronRight className="absolute top-4 right-4 text-slate-400 group-hover:h-8 group-hover:w-8 transition-all group-hover:text-primary"></ChevronRight>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default ProjectList