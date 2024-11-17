import { BadgeAlert, ChevronLeft, Loader, PlusCircle, Settings } from "lucide-react"
import { Separator } from "../../ui/separator"
import FolderStructure from "./FolderStructure"
import { useEffect, useState } from "react"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import useEditChangesStore from "@/store/changes"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar"
import { ProjectSwitcher } from "./Project-Switcher"
import { NavUser } from "@/components/custom/NavUser"
import { NavLink } from "react-router-dom"
import useAddFolderContext from "@/shared/custom hooks/useDialogContext"

const NavigationSideBar = () => {
    const axiosInstance = useAxiosWithToast()
    const [projs, setProjs] = useState([])
    const { setFolder, folder, setSelectedFolder, loading, setLoading, isNoFilePresent } = useFolderStore(state => state)
    const project = useProjectStore(state => state.project)
    const {convertIntoLinkedList , clearList} = useDoublyLinkedListStore(state => state)
    const { isEditing, editedFolder } = useEditChangesStore(state => state)
    const { user } = useUserStore(state => state)
    const AddPageDialog = useAddFolderContext()

    useEffect(() => {
        setLoading(true)
        // check if folder is present in editedFilesArray

        const isFolderExists = editedFolder.find(file => {
            return file.type === "folder"
        })

        if (isFolderExists && isEditing) {
            let folder = JSON.parse(isFolderExists.changedContent!)
            setFolder(folder)
            clearList()
            convertIntoLinkedList(folder)
            setSelectedFolder(folder[0])
            setLoading(false)
        } else {
            getFolderJson()
        }
    }, [editedFolder, project])

    useEffect(() => {

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
    }, []);

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

    function createFolder() {
        AddPageDialog?.open()
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <ProjectSwitcher projectList={projs}></ProjectSwitcher>
                <SidebarMenuButton asChild>
                    <NavLink to="/dashboard">
                        <ChevronLeft />
                        <span>Home</span>
                    </NavLink>
                </SidebarMenuButton>
                {
                    isEditing &&
                    <SidebarMenuButton onClick={() => { createFolder() }} >
                        <PlusCircle></PlusCircle>
                        Create new file
                    </SidebarMenuButton>
                }
            </SidebarHeader>
            <SidebarContent>
                <Separator />
                {
                    isNoFilePresent ? <div className="flex-1 m-2 flex items-center justify-center text-center">
                        <p className="text-muted-foreground">Look's like no file is been created</p>
                    </div> : <FolderStructure folder={folder} />
                }
                {
                    loading && <div className="absolute h-full w-full top-0 left-0 flex items-center justify-center bg-slate-400/20">
                        <Loader className="animate-spin"></Loader>
                    </div>
                }
            </SidebarContent>
            <Separator />
            <SidebarFooter>
                {(project?.Role === "Admin" || project?.Role === "Editor") && (
                    <>
                        <SidebarMenuButton asChild>
                            <NavLink to={`/project/${project?.Id}/settings`}>
                                <Settings />
                                <span>Setting</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </>
                )}
                <SidebarMenuButton asChild>
                    <a href="https://documentthing.featurebase.app/" target="_blank">
                        <BadgeAlert></BadgeAlert>
                        Feature Request / Bug report
                    </a>
                </SidebarMenuButton>
                <NavUser></NavUser>
            </SidebarFooter>
        </Sidebar>
    )
}

export default NavigationSideBar