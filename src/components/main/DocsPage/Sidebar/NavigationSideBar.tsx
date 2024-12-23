import { BadgeAlert, ChevronLeft, Hash, Loader, PlusCircle, Settings } from "lucide-react"
import { Separator } from "../../../ui/separator"
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
import Export from "./Export"
import useBranchStore from "@/store/branch"

const NavigationSideBar = () => {
    const axiosInstance = useAxiosWithToast()
    const [projs, setProjs] = useState([])
    const { setFolder, folder, setSelectedFolder, loading, setLoading } = useFolderStore(state => state)
    const project = useProjectStore(state => state.project)
    const { convertIntoLinkedList, clearList } = useDoublyLinkedListStore(state => state)
    const { isEditing, editedFolder } = useEditChangesStore(state => state)
    const { user } = useUserStore(state => state)
    const AddPageDialog = useAddFolderContext()
    const { name } = useBranchStore(state => state)

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

    function getFolderJson() {
        if(isEditing && name === "") return
        axiosInstance.get(`/folder/${project?.Id}/${user?.Type}/${isEditing ? name : "main"}`).then(data => {
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

    useEffect(() => {
        getFolderJson()
    }, [isEditing])

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


    function createFolder() {
        AddPageDialog?.open()
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <ProjectSwitcher projectList={projs}></ProjectSwitcher>
                {
                    isEditing &&
                    <div>
                        <Separator />
                        <SidebarMenuButton>
                            <Hash></Hash>
                            {name}
                        </SidebarMenuButton>
                        <Separator />
                    </div>
                }
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
                <FolderStructure folder={folder} />
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
                <Export></Export>
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