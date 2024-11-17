import { Loader, SaveAll } from "lucide-react"
import { Button } from "../../ui/button"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import { useEffect, useRef, useState } from "react"
import BreadCrums from "./BreadCrums"
import useEditChangesStore from "@/store/changes"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastAction } from "@/components/ui/toast"
import useUserStore from "@/store/userStore"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import { useToast } from "@/components/ui/use-toast"

const Toolbar = () => {
    const axiosInstance = useAxiosWithToast()
    const [isLoading, setLoading] = useState(false)
    const project = useProjectStore(state => state.project)
    const { setFolder, setSelectedFolder, isNoFilePresent, Url } = useFolderStore(state => state)
    const { isEditing, setIsEditing, editedFiles, reset, editedFolder, editedMarkdown } = useEditChangesStore(state => state)
    const { user } = useUserStore(state => state)
    const [activeTab, setActiveTab] = useState<string>("preview")
    const { convertIntoLinkedList, clearList } = useDoublyLinkedListStore(state => state)
    const webSocket = useRef<WebSocket | null>(null); // Use useRef to hold the WebSocket instance
    const { toast } = useToast()

    useEffect(() => {
        if (!project?.Id) return;

        // Establish WebSocket connection when projectId is available
        webSocket.current = setupWebSocket(project.Id);

        if (isEditing) {
            setActiveTab("edit");
        }

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
        axiosInstance.get(`/folder/${project?.Id}`).then(data => {
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


    function cancelEditing() {
        reset()
        setActiveTab("preview")
        setLoading(false)
    }

    const onSaveToServer = async () => {
        setLoading(true)
        let files = editedFiles.map(file => {
            if (file.changedContent !== file.originalContent) {
                return {
                    ...file,
                    changedContent: JSON.stringify(file.changedContent!),
                    originalContent: JSON.stringify(file.originalContent!)
                }
            }
        }).filter(file => file !== undefined); // Remove undefined values

        let folder = editedFolder.map(folder => {
            return {
                ...folder,
                changedContent: JSON.stringify(folder.changedContent!),
                originalContent: JSON.stringify(folder.originalContent!)
            }
        }).filter(file => file !== undefined); // Remove undefined values

        let markdown = editedMarkdown.map(file => {
            return {
                ...file,
                originalContent: JSON.stringify(file.originalContent!)
            }
        }).filter(file => file !== undefined); // Remove undefined values

        // setLoading(true)
        let response = await axiosInstance.post("/commit/save", {
            project_id: project?.Id,
            content: [...files, ...folder, ...markdown]
        })

        if (response.status === 200) {
            setLoading(false)
            reset()
            setActiveTab("preview")
            // Make sure the WebSocket is open before trying to send a message
            if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
                webSocket.current.send(JSON.stringify({
                    userID: user?.ID,
                    message: "Updated document"
                }));
            }
        } else {
            setLoading(false)
        }

        // const editorContent = editor.getEditorValue();
        // await fetchToServer(JSON.stringify(editorContent))
    }

    function onTabChange(value: string) {
        value === "preview" && cancelEditing()
        setIsEditing(value === "edit")
        setActiveTab(value);
    }

    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center justify-between p-1 px-4 border-b border-gray-100 bg-sidebar">
                <SidebarTrigger></SidebarTrigger>
                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        {
                            project?.Role !== "Viewer" && <TabsTrigger value="edit">Edit Mode</TabsTrigger>
                        }
                    </TabsList>
                </Tabs>
                {
                    project?.Role !== "Viewer" ? <>
                        {
                            isEditing ? <div className="flex gap-2">
                                <Button size={"sm"} className="flex gap-2" disabled={editedFiles.length === 0 || isLoading} onClick={onSaveToServer}>{
                                    isLoading ? <Loader className="animate-spin" height={18} width={18}></Loader> : <SaveAll height={18} width={18}></SaveAll>
                                } Save </Button>
                            </div> : <Button size={"sm"}>Publish</Button>
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