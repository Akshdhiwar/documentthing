
import { Excalidraw } from "@excalidraw/excalidraw";
import CustomWelcomeScreen from "./CustomWelcomeScreen";
import CustomMainMenu from "./CustomMainMenu";
import { useEffect, useState } from "react";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import { useParams } from "react-router-dom";
import useProjectStore from "@/store/projectStore";
import { Loader } from "lucide-react";
const Drawings = () => {
    const { folderID } = useParams()
    const axiosInstance = useAxiosWithToast()
    const [excalidrawAPI, setExcalidrawAPI] = useState<any | null>(null);
    const [initialData, setInitialData] = useState<any[] | null>(null);
    const { project } = useProjectStore(state => state)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getDrawing()
    }, [])

    useEffect(() => {
        console.log("changes");
    }, [isLoading])

    async function getDrawing() {
        setIsLoading(true)
        const response = await axiosInstance.get(`/file/drawings/${folderID}`, {
            params: {
                proj: project?.Id
            }
        })
        setIsLoading(false)
        setInitialData(JSON.parse(atob(response.data)))
    }

    return (
        <div className="h-dvh w-dvw">
            {
                !isLoading ? <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)}
                        initialData={
                            {
                                elements: initialData,
                            }
                        }
                    >
                        <CustomWelcomeScreen />
                        <CustomMainMenu excalidrawApi={excalidrawAPI}></CustomMainMenu>
                    </Excalidraw>
                    : <div className="flex items-center justify-center">
                        <Loader className="animate-spin"></Loader>
                    </div>
            }
        </div>
    )
}

export default Drawings