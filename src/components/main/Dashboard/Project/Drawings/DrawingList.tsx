import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, Loader, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import { TrackPageView } from "@/shared/utils/GoogleAnalytics"
import useProjectStore from "@/store/projectStore"

const DrawingList = () => {
    const axiosInstance = useAxiosWithToast()
    const [loading, setLoading] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const { user } = useUserStore(state => state)
    const { setProject } = useProjectStore(state => state)

    function getProjectList() {
        setLoading(true)
        axiosInstance.get("/project/drawings", {
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
        TrackPageView()
        getProjectList()
    }, [])

    function goToSpecificProject(project: Project) {
        setProject(project)
    }

    return (
        <ScrollArea className="p-5">
            <div>
                {
                    loading ? <div className="flex items-center justify-center"><Loader className="animate-spin"></Loader></div> : <ul className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {
                            projects.map((project, index) => (
                                <Link to={`sub-list/${project.Id}`} role="button" key={index} className="w-full flex flex-col justify-between group relative h-44 border rounded-md hover:cursor-pointer p-4 transition-all hover:bg-primary/10" onClick={() => goToSpecificProject(project)}>
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
                        <Link to={"../new?type=drawings"}>
                            <Card className="h-full transition-all hover:border-primary hover:shadow-md hover:cursor-pointer">
                                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <div className="mb-4 p-3 rounded-full bg-primary/10">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Create a new project to start building
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </ul>
                }
            </div>
        </ScrollArea>
    )
}

export default DrawingList