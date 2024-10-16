import { Check, Loader, PlusCircle, Settings, X } from "lucide-react"
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

const NavigationSideBar = () => {
    const axiosInstance = useAxiosWithToast()
    const [newFolder, setNewFolder] = useState(false)
    let InputRef = useRef<HTMLInputElement>(null)
    const { createPage, setFolder, folder, setSelectedFolder, loading, setLoading, isNoFilePresent } = useFolderStore(state => state)
    const project = useProjectStore(state => state.project)
    const convertIntoLinkedList = useDoublyLinkedListStore(state => state.convertIntoLinkedList)
    const clearLinkList = useDoublyLinkedListStore(state => state.clearList)
    const { isEditing, editedFolder } = useEditChangesStore(state => state)

    useEffect(() => {
        setLoading(true)
        // check if folder is present in editedFilesArray

        const isFolderExists = editedFolder.find(file => {
            return file.type === "folder"
        })

        if (isFolderExists && isEditing) {
            let folder = JSON.parse(isFolderExists.changedContent!)
            setFolder(folder)
            convertIntoLinkedList(folder)
            setSelectedFolder(folder[0])
            setLoading(false)
        } else {
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

        return () => {
            clearLinkList()
            useFolderStore.getState().setIsNoFilePresent(false)
            useFolderStore.getState().setFolder([])
        }
    }, [editedFolder])

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
        <div className="h-full flex flex-col w-full relative">
            {
                isEditing && <div className="m-2">
                    {/* <Link label="Home" href="/dashboard" icon={ChevronLeft}></Link> */}
                    <Item label="Create new file" onClick={() => { createFolder() }} icon={PlusCircle}></Item>
                </div>
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
            {
                project?.Role === "Admin" && <>
                    <Separator />
                    <div className="m-2 flex flex-col gap-1">
                        {/* <Item label="Dark / light" onClick={() => { alert("hello") }} icon={Moon}></Item> */}
                        <Link label="Setting" href={`/project/${project?.Id}/settings`} icon={Settings}></Link>
                    </div>
                </>
            }
            {
                loading && <div className="absolute h-full w-full top-0 left-0 flex items-center justify-center bg-slate-400/20">
                    <Loader className="animate-spin"></Loader>
                </div>
            }

        </div>
    )
}

export default NavigationSideBar