import { ChevronRight, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useUserStore from "@/store/userStore"
import useProjectStore from "@/store/projectStore"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrackPageView } from "@/shared/utils/GoogleAnalytics"

const ProjectList = () => {
  const axiosInstance = useAxiosWithToast()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const { user } = useUserStore(state => state)
  const setProject = useProjectStore(state => state.setProject)

  function getProjectList() {
    setLoading(true)
    axiosInstance.get("/project/get-project", {
      params: {
        id: user?.ID
      }
    }).then(result => {
      setProjects(result.data === null ? [] : result.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
    })
  }

  useEffect(() => {
    TrackPageView(user?.Name, user?.ID)
    getProjectList()
  }, [])

  function goToSpecificProject(project: Project) {
    setProject(project)
  }

  return (
    <ScrollArea className="p-5">
      <div className="flex gap-2 items-center justify-between">
        {/* <div className="relative">
          <Input className="pl-8 h-[32px]"></Input>
          <Search height={18} width={18} className="absolute top-[7px] left-2 text-slate-400"></Search>
        </div> */}
      </div>
      <div>
        {
          loading ? <div className="flex items-center justify-center"><Loader className="animate-spin"></Loader></div> : <ul className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {
              projects.map((project, index) => (
                <Link to={`/project/${project.Id}/docs`} role="button" key={index} className="w-full flex flex-col justify-between group relative h-44 border rounded-md hover:cursor-pointer p-4 transition-all hover:bg-primary/10" onClick={() => goToSpecificProject(project)}>
                  <div>
                    <p className="truncate mr-6 text-sm">{project.Name}</p>
                    <ChevronRight className="absolute top-4 right-4 text-slate-400 group-hover:h-8 group-hover:w-8 transition-all group-hover:text-primary/30"></ChevronRight>
                  </div>
                  <div className="text-sm text-secondary-foreground flex justify-between">
                    <p><span className="text-muted-foreground">Owner: </span>  {project.RepoOwner}</p>
                    <p>{project.Role}</p>
                  </div>
                </Link>
              ))
            }
          </ul>
        }
      </div>
    </ScrollArea>

  )
}

export default ProjectList