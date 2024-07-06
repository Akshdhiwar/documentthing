import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import NavigationSideBar from "./NavigationSideBar"
import { FolderContext } from "@/context/FolderContext"
import { useContext } from "react"
import { EditorContext } from "@/context/EditorContext"
import axios from "axios"

const Toolbar = () => {

    const folder = useContext(FolderContext)
    const editor = useContext(EditorContext)

    const fetchToServer = async (data: string) => {
        axios.post(`http://localhost:3000/api/v1/file/${folder?.selected.fileId}`, { file: data }).then(data => {
            console.log(data.data)
        })
    }

    const onSaveToServer = async () => {
        const editorContent = editor?.editor.getEditorValue();
        await fetchToServer(JSON.stringify(editorContent))
    }

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
            <Button size={"sm"} disabled={!folder?.selected} onClick={onSaveToServer}>Save </Button>
        </div>
    )
}

export default Toolbar