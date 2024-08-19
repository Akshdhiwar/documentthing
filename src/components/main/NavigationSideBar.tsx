import { Check, Moon, PlusCircle, Search, Settings, X } from "lucide-react"
import Item from "../custom/Item"
import { Separator } from "../ui/separator"
import FolderStructure from "./FolderStructure"
import { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"

const NavigationSideBar = () => {

    const [newFolder, setNewFolder] = useState(false)
    let InputRef = useRef<HTMLInputElement>(null)
    const createPage = useFolderStore(state => state.createPage)
    const setFolder = useFolderStore(state => state.setFolder)
    const folder = useFolderStore(state => state.folder)
    const projectId = useProjectStore(state => state.project)

    useEffect(()=>{
        axiosInstance.get(`/folder/${projectId?.Id}`).then(data=> {
            const res  = data.data
            const json = JSON.parse(atob(res))
            setFolder(json)
        })
    },[])

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
        <div className="h-full flex flex-col w-full">
            <div className="m-2">
                <Item label="Search" onClick={() => { alert("hello") }} icon={Search}></Item>
                <Item label="Create new file" onClick={() => { createFolder() }} icon={PlusCircle}></Item>
            </div>
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
            <div className="flex-1 overflow-auto m-2">
                <FolderStructure folder={folder} />
            </div>
            <Separator />
            <div className="m-2 flex flex-col gap-1">
                <Item label="Dark / light" onClick={() => { alert("hello") }} icon={Moon}></Item>
                <Item label="Setting" onClick={() => { alert("hello") }} icon={Settings}></Item>
            </div>
        </div>
    )
}

export default NavigationSideBar