import { Check, Moon, PlusCircle, Search, Settings, X } from "lucide-react"
import Item from "../custom/Item"
import { Separator } from "../ui/separator"
import FolderStructure from "./FolderStructure"
import { useContext, useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FolderContext } from "@/Context&Providers/context/FolderContext"
import { useParams } from "react-router-dom"
import axiosInstance from "@/shared/axios intercepter/axioshandler"

const NavigationSideBar = () => {

    const folder = useContext(FolderContext)
    const [newFolder, setNewFolder] = useState(false)
    let InputRef = useRef<HTMLInputElement>(null)
    let {folderId} = useParams()

    useEffect(()=>{
        axiosInstance.get(`/folder/${folderId}`).then(data=> {
            const res  = JSON.parse(data.data.folderStructure)
            folder?.setFolder(res)
        })
    },[])

    function createFolder() {
        setNewFolder(true)
    }

    function addPage(event: React.FormEvent) {
        event.preventDefault()
        folder?.createPage(InputRef.current!.value)
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
                    <form onSubmit={addPage} className="flex gap-1 items-center my-2">
                        <Input className="flex-1 h-8" ref={InputRef}></Input>
                        <Button className="p-1 h-8 w-8" type="submit"><Check className="h-[16px]"></Check></Button>
                        <Button className="p-1 h-8 w-8" onClick={() => { setNewFolder(false) }}><X className="h-[16px]"></X></Button>
                    </form>
                )
            }
            <div className="flex-1 overflow-auto m-2">
                <FolderStructure folder={folder?.folder} />
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