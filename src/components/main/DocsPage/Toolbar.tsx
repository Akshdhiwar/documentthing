import { Loader, Menu, SaveAll } from "lucide-react"
import { Button } from "../../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet"
import NavigationSideBar from "./NavigationSideBar"
import useFolderStore from "@/store/folderStore"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useProjectStore from "@/store/projectStore"
import { useState } from "react"
import BreadCrums from "./BreadCrums"
import Export from "./Export"
import useEditChangesStore from "@/store/changes"

const Toolbar = () => {

    const [isLoading, setLoading] = useState(false)
    const project = useProjectStore(state => state.project)
    const { Url, isNoFilePresent } = useFolderStore(state => state)
    const { isEditing, setIsEditing, editedFiles, reset, editedFolder , editedMarkdown } = useEditChangesStore(state => state)

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
        axiosInstance.post("/commit/save", {
            project_id: project?.Id,
            content: [...files, ...folder , ...markdown]
        }).then(()=>{
            setLoading(false)
            reset()
        })

        // const editorContent = editor.getEditorValue();
        // await fetchToServer(JSON.stringify(editorContent))
    }


    return (
        <div className="flex items-center justify-between p-1 mx-4">
            <div className="md:hidden order-1">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size={"icon"} className="p-1" variant={"ghost"}><Menu height={18} width={18}></Menu></Button>
                    </SheetTrigger>
                    <SheetContent className="p-0" side={"left"}>
                        <NavigationSideBar />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="order-2">
                {
                    !isNoFilePresent && Url && <BreadCrums UrlString={Url} />
                }
            </div>
            {
                isEditing ? <div className="order-3 flex gap-2">
                    <Export></Export>
                    <Button size={"sm"} className="flex gap-2" disabled={editedFiles.length === 0 || isLoading} onClick={onSaveToServer}>{
                        isLoading ? <Loader className="animate-spin" height={18} width={18}></Loader> : <SaveAll height={18} width={18}></SaveAll>
                    } Save changes</Button>
                    <Button className="order-3" size={"sm"} onClick={() => cancelEditing()}>Cancel Editing</Button>
                </div> : <Button className="order-3" size={"sm"} onClick={() => setIsEditing(true)}>Edit</Button>
            }

        </div>
    )
}

export default Toolbar