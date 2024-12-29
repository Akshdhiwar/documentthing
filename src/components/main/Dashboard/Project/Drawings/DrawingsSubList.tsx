import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Loader } from "lucide-react";
import DrawingNew from "./DrawingNew";
import { useEffect, useState } from "react";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import { Link, useParams } from "react-router-dom";

const DrawingsSubList = () => {
  const axiosInstance = useAxiosWithToast()
  const [loading, setLoading] = useState(true)
  const { projectID } = useParams()
  const [projects, setProjects] = useState<string[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)

  async function getDrawingsSubList() {
    await axiosInstance.get("/file/drawings", {
      params: {
        proj: projectID,
      }
    }).then(result => {
      setProjects(result.data === null ? [] : result.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
    })
  }

  useEffect(() => {
    getDrawingsSubList()
  }, [refresh])

  return (
    <ScrollArea className="p-5">
      <div>
        {
          loading ? <div className="flex items-center justify-center"><Loader className="animate-spin"></Loader></div> : <ul className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {
              projects.map((project, index) => (
                <Link to={`/drawings/${project}`} role="button" key={index} className="w-full flex flex-col justify-between group relative h-44 border rounded-md hover:cursor-pointer p-4 transition-all hover:bg-primary/10">
                  <div>
                    <p className="truncate mr-6 text-sm">{project}</p>
                    <ChevronRight className="absolute top-4 right-4 text-slate-400 group-hover:h-8 group-hover:w-8 transition-all group-hover:text-primary/30"></ChevronRight>
                  </div>
                </Link>
              ))
            }
            <DrawingNew refresh={setRefresh} />
          </ul>
        }
      </div>
    </ScrollArea>
  )
}

export default DrawingsSubList