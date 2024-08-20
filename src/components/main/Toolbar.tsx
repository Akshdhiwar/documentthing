import { Loader, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import NavigationSideBar from "./NavigationSideBar"
import useFolderStore from "@/store/folderStore"
import useEditorStore from "@/store/editorStore"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useProjectStore from "@/store/projectStore"
import { useState } from "react"
// import {plainText , markdown , html} from "@yoopta/exports"

const Toolbar = () => {

    const [isLoading, setLoading] = useState(false)
    const selectedFolder = useFolderStore(state => state.selectedFolder)
    const project = useProjectStore(state => state.project)
    const editor = useEditorStore(state => state.editor)
    const Url = useFolderStore(state => state.Url)

    const fetchToServer = async (data: string) => {
        setLoading(true)
        axiosInstance.put(`/file/update`, {
            project_id: project?.Id,
            file_id: selectedFolder?.fileId,
            content: btoa(JSON.stringify(data))
        }).then(() =>
            setLoading(false)
        ).catch(err => {
            console.error(err)
        })
    }

    const onSaveToServer = async () => {
        const editorContent = editor.getEditorValue();
        await fetchToServer(JSON.stringify(editorContent))
    }

    // const serializeText = () => {
    //     const data = editor?.editor.getEditorValue();
    //     const textString = html.serialize(editor?.editor, data);
    //     console.log('plain text string', textString);
    //   };

    return (
        <div className="flex items-center justify-between md:justify-end p-1">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size={"icon"} className="p-1" variant={"ghost"}><Menu height={18} width={18}></Menu></Button>
                    </SheetTrigger>
                    <SheetContent className="p-0" side={"left"}>
                        <NavigationSideBar />
                    </SheetContent>
                </Sheet>
            </div>
            {
                Url
            }
            <Button size={"sm"} className="w-14" disabled={!selectedFolder || isLoading} onClick={onSaveToServer}>{
                isLoading ? <Loader className="animate-spin" height={18} width={18}></Loader> : "Save"
            }</Button>
        </div>
    )
}

export default Toolbar