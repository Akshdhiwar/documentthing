import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChevronRight, Loader, Plus, Search } from "lucide-react"
import ProjectCreationDailog from "./ProjectCreationDailog"
import { useContext, useEffect, useState } from "react"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import { useNavigate } from "react-router-dom"
import { UserContext } from "@/Context&Providers/context/UserContext"


const ProjectList = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const navigate = useNavigate()
  const user = useContext(UserContext);

  function getProjectList() {
    setLoading(true)
    axiosInstance.get("/project/get-project", {
      params: {
        name: user?.user.GithubName,
        id: user?.user.ID
      }
    }).then(result => {
      setProjects(result.data === null ? [] : result.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
    })
  }

  function goToSpecificProject(folderId: string) {
    navigate(`/project/${folderId}`)
  }

  useEffect(() => {
    getProjectList()
  }, [refresh])

  return (
    <div className="p-5">
      <div className="flex gap-2 items-center justify-between">
        <div className="relative">
          <Input className="pl-8 h-[32px]"></Input>
          <Search height={18} width={18} className="absolute top-[7px] left-2 text-slate-400"></Search>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} className=" h-[32px]">New Organization</Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center gap-1  h-[32px]"><Plus height={18} width={18}></Plus> <p>New Project</p></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <ProjectCreationDailog close={setOpenDialog} refresh={setRefresh} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="my-6">
        {
          loading ? <div className="flex items-center justify-center"><Loader className="animate-spin"></Loader></div> : <ul className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {
              projects.map((project, index) => (
                <div role="button" key={index} className="w-full group relative h-44 border rounded-md hover:cursor-pointer p-4 transition-all hover:bg-primary/10" onClick={() => goToSpecificProject(project.Id)}>
                  <p className="truncate mr-6 text-sm">{project.Name}</p>
                  <ChevronRight className="absolute top-4 right-4 text-slate-400 group-hover:h-8 group-hover:w-8 transition-all group-hover:text-primary/30"></ChevronRight>
                </div>
              ))
            }
          </ul>
        }

      </div>
    </div>
  )
}

export default ProjectList