import { Check, ChevronLeft, Loader, PlusCircle, Settings, X } from "lucide-react"
import Item from "../../custom/Item"
import { Separator } from "../../ui/separator"
import FolderStructure from "./FolderStructure"
import { useEffect, useRef, useState } from "react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import { useNavigate } from "react-router-dom"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"

const NavigationSideBar = () => {
    const navigate = useNavigate()
    const [newFolder, setNewFolder] = useState(false)
    let InputRef = useRef<HTMLInputElement>(null)
    const createPage = useFolderStore(state => state.createPage)
    const setFolder = useFolderStore(state => state.setFolder)
    const folder = useFolderStore(state => state.folder)
    const projectId = useProjectStore(state => state.project)
    const setSelectedFile = useFolderStore(state => state.setSelectedFolder)
    const isLoading = useFolderStore(state => state.loading)
    const setLoading = useFolderStore(state => state.setLoading)
    const isNoFilePresent = useFolderStore(state => state.isNoFilePresent)
    const convertIntoLinkedList = useDoublyLinkedListStore(state => state.convertIntoLinkedList)
    const clearLinkList = useDoublyLinkedListStore(state => state.clearList)

    useEffect(() => {
        setLoading(true)
        axiosInstance.get(`/folder/${projectId?.Id}`).then(data => {
            const res = data.data
            const json: Folder[] = JSON.parse(atob(res))
            setFolder(json)
            if (json.length > 0) {
                clearLinkList()
                convertIntoLinkedList(json)
                setSelectedFile(json[0])
            }
            setLoading(false)
        })
        return () => {
            clearLinkList()
            useFolderStore.getState().setIsNoFilePresent(false)
            useFolderStore.getState().setFolder([])
        }
    }, [])

    useEffect(()=>{
        console.log(folder)
    },[folder])

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

    function goToHome() {
        navigate("/dashboard")
    }

    return (
        <div className="h-full flex flex-col w-full relative">
            <div className="m-2">
                <Item label="Home" onClick={() => { goToHome() }} icon={ChevronLeft}></Item>
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
            {
                isNoFilePresent ? <div className="flex-1 m-2 flex items-center justify-center text-center">
                    <p className="text-muted-foreground">Look's like no file is been created</p>
                </div> : <div className="flex-1 overflow-auto m-2">
                    <FolderStructure folder={folder} />
                </div>
            }
            <Separator />
            <div className="m-2 flex flex-col gap-1">
                {/* <Item label="Dark / light" onClick={() => { alert("hello") }} icon={Moon}></Item> */}
                <Item label="Setting" onClick={() => { alert("hello") }} icon={Settings}></Item>
            </div>
            {
                isLoading && <div className="absolute h-full w-full top-0 left-0 flex items-center justify-center bg-slate-400/20">
                    <Loader className="animate-spin"></Loader>
                </div>
            }

        </div>
    )
}

export default NavigationSideBar