import { Check, ChevronLeft, Loader, PlusCircle, Settings, X } from "lucide-react"
import Item from "../../custom/Item"
import { Separator } from "../../ui/separator"
import FolderStructure from "./FolderStructure"
import { useEffect, useRef, useState } from "react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import Link from "@/components/custom/Link"
import useEditChangesStore from "@/store/changes"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import useUserStore from "@/store/userStore"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar"
import { ProjectSwitcher } from "./Project-Switcher"
import { NavUser } from "@/components/custom/NavUser"

const NavigationSideBar = () => {
    const { toast } = useToast()
    const axiosInstance = useAxiosWithToast()
    const [newFolder, setNewFolder] = useState(false)
    const [projs, setProjs] = useState([])
    let InputRef = useRef<HTMLInputElement>(null)
    const { createPage, setFolder, folder, setSelectedFolder, loading, setLoading, isNoFilePresent } = useFolderStore(state => state)
    const project = useProjectStore(state => state.project)
    const convertIntoLinkedList = useDoublyLinkedListStore(state => state.convertIntoLinkedList)
    const clearLinkList = useDoublyLinkedListStore(state => state.clearList)
    const { isEditing, editedFolder } = useEditChangesStore(state => state)
    const { user } = useUserStore(state => state)

    useEffect(() => {
        setLoading(true)
        // check if folder is present in editedFilesArray

        const isFolderExists = editedFolder.find(file => {
            return file.type === "folder"
        })

        if (isFolderExists && isEditing) {
            let folder = JSON.parse(isFolderExists.changedContent!)
            setFolder(folder)
            clearLinkList()
            convertIntoLinkedList(folder)
            setSelectedFolder(folder[0])
            setLoading(false)
        } else {
            getFolderJson()
        }
    }, [editedFolder])

    useEffect(() => {
        let isPolling = true; // A flag to manage polling loop and cleanup on unmount

        const pollForUpdates = async () => {
            try {
                const response = await axiosInstance.get(`/project/${project?.Id}/updates`);

                if (response.status === 200) {
                    // If an update is received, show a success toast
                    if (response.data.updatedBy !== user?.ID) {
                        toast({
                            variant: "default",
                            title: 'Someone in your team updated the document',
                            description: 'Click on refresh to get the latest document',
                            action: <ToastAction altText="refresh" onClick={getFolderJson}>Refresh</ToastAction>

                        });
                    }

                }
            } catch (error) {
                console.error('Error polling for updates:', error);  // Handle any network or request errors
            }

            // Continue polling as long as the component is mounted
            if (isPolling) {
                setTimeout(pollForUpdates, 100);  // Poll again after 5 seconds (adjust interval as needed)
            }
        };

        axiosInstance.get("/project/get-project", {
            params: {
                name: user?.GithubName,
                id: user?.ID
            }
        }).then(result => {
            setProjs(result.data === null ? [] : result.data)
        }).catch(err => {
            console.error(err)
        })

        // Start the polling loop
        pollForUpdates();

        // Cleanup function to stop polling when the component is unmounted
        return () => {
            isPolling = false;  // Stop polling on unmount
        };
    }, []);

    function getFolderJson() {
        axiosInstance.get(`/folder/${project?.Id}`).then(data => {
            const res = data.data
            const json: Folder[] = JSON.parse(JSON.parse(atob(res)))
            setFolder(json)
            if (json.length > 0) {
                clearLinkList()
                convertIntoLinkedList(json)
                setSelectedFolder(json[0])
            }
            setLoading(false)
        })
    }

    function createFolder() {
        setNewFolder(true)
    }

    function addPage(event: React.FormEvent) {
        event.preventDefault()
        createPage(InputRef.current!.value)
        setNewFolder(false)
    }

    // useEffect to focus the input when newFolder changes to true
    useEffect(() => {
        if (newFolder && InputRef.current) {
            InputRef.current.focus();
        }
    }, [newFolder]);

    return (

        <Sidebar>
            <SidebarHeader>
                <ProjectSwitcher projectList={projs}></ProjectSwitcher>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenuButton>
                    <Link label="Home" href="/dashboard" icon={ChevronLeft}></Link>
                </SidebarMenuButton>
                {
                    isEditing &&
                    <SidebarMenuButton>
                        <Item label="Create new file" onClick={() => { createFolder() }} icon={PlusCircle}></Item>
                    </SidebarMenuButton>
                }
                <Separator />
                {
                    newFolder && (
                        <form onSubmit={addPage} className="flex gap-1 items-center m-2">
                            <Input className="flex-1 h-8" ref={InputRef}></Input>
                            <Button className="p-1 h-8 w-8" type="submit"><Check className="h-[16px]"></Check></Button>
                            <Button className="p-1 h-8 w-8" onClick={() => { setNewFolder(false) }}><X className="h-[16px]"></X></Button>
                        </form>
                    )
                }
                {
                    isNoFilePresent ? <div className="flex-1 m-2 flex items-center justify-center text-center">
                        <p className="text-muted-foreground">Look's like no file is been created</p>
                    </div> : <div className="flex-1 overflow-auto m-2">
                        <FolderStructure folder={folder} />
                    </div>
                }
                {(project?.Role === "Admin" || project?.Role === "Editor") && (
                    <>
                        <Separator />
                        <div className="m-2 flex flex-col gap-1">
                            {/* <Item label="Dark / light" onClick={() => { alert("hello") }} icon={Moon}></Item> */}
                            <Link label="Setting" href={`/project/${project?.Id}/settings`} icon={Settings}></Link>
                        </div>
                    </>
                )}

                {
                    loading && <div className="absolute h-full w-full top-0 left-0 flex items-center justify-center bg-slate-400/20">
                        <Loader className="animate-spin"></Loader>
                    </div>
                }
            </SidebarContent>
            <SidebarFooter>
                <NavUser></NavUser>
            </SidebarFooter>
        </Sidebar>
    )
}

export default NavigationSideBar