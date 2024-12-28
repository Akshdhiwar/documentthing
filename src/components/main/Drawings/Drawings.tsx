
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

    useEffect(() => {
        getDrawing()
    }, [])

    async function getDrawing() {
        try {
            const response = await axiosInstance.get(`/file/drawings/${folderID}`, {
                params: {
                    proj: project?.Id
                }
            })
            setInitialData(JSON.parse(JSON.parse(atob(response.data))))
            console.log(JSON.parse(JSON.parse(atob(response.data))))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="h-dvh w-dvw">
            {
                initialData ? <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)}
                // initialData={
                //     {
                //         elements : 
                //     }
                // } 
                >
                    <CustomWelcomeScreen />
                    <CustomMainMenu excalidrawApi={excalidrawAPI}></CustomMainMenu>
                </Excalidraw> : <div className="flex items-center justify-center">
                    <Loader className="animate-spin"></Loader>
                </div>
            }
        </div>
    )
}

export default Drawings