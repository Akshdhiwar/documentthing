import { Loader, SaveAll } from "lucide-react"
import { Button } from "../../ui/button"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import { useState } from "react"
import BreadCrums from "./BreadCrums"
import useEditChangesStore from "@/store/changes"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Toolbar = () => {
    const axiosInstance = useAxiosWithToast()
    const [isLoading, setLoading] = useState(false)
    const project = useProjectStore(state => state.project)
    const { Url, isNoFilePresent } = useFolderStore(state => state)
    const { isEditing, setIsEditing, editedFiles, reset, editedFolder, editedMarkdown } = useEditChangesStore(state => state)
    const [activeTab, setActiveTab] = useState<string>("preview")

    // const fetchToServer = async (data: string) => {
    //     setLoading(true)
    //     axiosInstance.put(`/file/update`, {
    //         project_id: project?.Id,
    //         file_id: selectedFolder?.id,
    //         content: btoa(JSON.stringify(data))
    //     }).then(() =>
    //         setLoading(false)
    //     ).catch(err => {
    //         console.error(err)
    //     })
    // }

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
                    project?.Role !== "Viewer" && <>
                        {
                            isEditing ? <div className="flex gap-2">
                                <Button size={"sm"} className="flex gap-2" disabled={editedFiles.length === 0 || isLoading} onClick={onSaveToServer}>{
                                    isLoading ? <Loader className="animate-spin" height={18} width={18}></Loader> : <SaveAll height={18} width={18}></SaveAll>
                                } Save changes</Button>
                            </div> : <Button size={"sm"}>Publish</Button>
                        }
                    </>
                }
            </div>
            {/* <Separator/> */}
            <div className={`${!isNoFilePresent && Url && "p-1 px-4 border-b border-slate-100"}`}>
                {
                    !isNoFilePresent && Url && <BreadCrums UrlString={Url} />
                }
            </div>
        </div>
    )
}

export default Toolbar