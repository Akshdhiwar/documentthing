import { Button } from "../../../ui/button"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import { useEffect, useRef, useState } from "react"
import BreadCrums from "./BreadCrums"
import useEditChangesStore from "@/store/changes"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ToastAction } from "@/components/ui/toast"
import useUserStore from "@/store/userStore"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ToggleEditPreview from "./ToggleEditPreview"
import Save from "./Save"


const Toolbar = () => {
    const axiosInstance = useAxiosWithToast()
    const [isLoading, setLoading] = useState(false)
    const project = useProjectStore(state => state.project)
    const { setFolder, setSelectedFolder, isNoFilePresent, Url } = useFolderStore(state => state)
    const { isEditing } = useEditChangesStore(state => state)
    const { user } = useUserStore(state => state)
    const { convertIntoLinkedList, clearList } = useDoublyLinkedListStore(state => state)
    const webSocket = useRef<WebSocket | null>(null); // Use useRef to hold the WebSocket instance
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState<string>("preview")

    useEffect(() => {
        if (!project?.Id) return;

        // Establish WebSocket connection when projectId is available
        webSocket.current = setupWebSocket(project.Id);

        // Clean up WebSocket on component unmount
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [project?.Id, isEditing]);

    function setupWebSocket(projectID: string) {

        const baseURL =
            import.meta.env.VITE_ENVIRONMENT === "Local"
                ? "ws://localhost:3000/api/v1"
                : "wss://betterdocs-backend-production.up.railway.app/api/v1" // Replace with your API base URL

        const ws = new WebSocket(`${baseURL}/project/${projectID}/updates`);

        // Handle incoming messages
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // If an update is received, show a success toast
            if (data.userID !== user?.ID) {
                toast({
                    variant: "default",
                    title: 'Someone in your team updated the document',
                    description: 'Click on refresh to get the latest document',
                    action: <ToastAction altText="refresh" onClick={() => getFolderJson()}>Refresh</ToastAction>
                });
            }
        };

        // Handle errors
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return ws;
    }

    function getFolderJson() {
        axiosInstance.get(`/folder/${project?.Id}/${user?.Type}`).then(data => {
            const res = data.data
            const json: Folder[] = JSON.parse(JSON.parse(atob(res)))
            setFolder(json)
            if (json.length > 0) {
                clearList()
                convertIntoLinkedList(json)
                setSelectedFolder(json[0])
            }
            setLoading(false)
        })
    }



    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center justify-between p-1 px-4 border-b border-gray-100 bg-sidebar">
                <SidebarTrigger></SidebarTrigger>
                <ToggleEditPreview activeTab={activeTab} setActiveTab={setActiveTab}></ToggleEditPreview>
                {
                    project?.Role !== "Viewer" ? <>
                        {
                            isEditing ? <Save isLoading={isLoading} setActiveTab={setActiveTab} setLoading={setLoading} webSocket={webSocket} /> : <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={"sm"}>Publish</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>🚧 Publish to Internet is currently under development and will be available soon. Stay tuned!</p>
                                </TooltipContent>
                            </Tooltip>
                        }
                    </> : <div></div>
                }
            </div>
            <div className={`${!isNoFilePresent && Url && "p-1 px-4 border-b border-slate-100 truncate"}`}>
                {
                    !isNoFilePresent && Url && <BreadCrums UrlString={Url} />
                }
            </div>
        </div>
    )
}

export default Toolbar