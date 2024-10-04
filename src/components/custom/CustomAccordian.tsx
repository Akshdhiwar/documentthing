import { Check, ChevronRight, Ellipsis, File, FileText, Plus, SquarePen, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Item from "./Item";
import axiosInstance from "@/shared/axios intercepter/axioshandler";
import useFolderStore from "@/store/folderStore";
import useProjectStore from "@/store/projectStore";
import useDoublyLinkedListStore from "@/store/nextPreviousLinks";
import useEditChangesStore from "@/store/changes";

interface FolderInterface {
    child: Folder
}

const CustomAccordian = ({ child }: FolderInterface) => {
    const inputValue = useRef<HTMLInputElement>(null)
    const renameInputValue = useRef<HTMLInputElement>(null)
    const [newFolder, setNewFolder] = useState(false)
    const [open, setOpen] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const project = useProjectStore(state => state.project)
    const { addPage, setFolder, setSelectedFolder, selectedFolder, setLoading, folder } = useFolderStore(state => state)
    const { clearList, convertIntoLinkedList } = useDoublyLinkedListStore(state => state)
    const {isEditing , addEditedFile , addEditedFolder} = useEditChangesStore(state => state)



    useEffect(() => {
        child.children.forEach(file => {
            if (file.id === selectedFolder?.id) {
                setOpen(true)
            }
        })
    }, [selectedFolder])

    function addFileFolder(id: string) {
        if (inputValue.current) {
            addPage(inputValue.current.value, id);
            setNewFolder(false);
            setOpen(true);
        }
    }

    function openCloseAccordian() {
        setOpen(prev => !prev)
    }

    function openNew() {
        setNewFolder(true)
    }

    // useEffect to focus the input when newFolder changes to true
    useEffect(() => {
        if (newFolder && inputValue.current) {
            inputValue.current.focus();
        }
    }, [newFolder]);

    function deleteFolderRecursive(id: string, folder: Folder[]) {
        let temp : Folder[] = []

        folder.forEach((file) => {
            if (file.id === id){
                if (file.children.length > 0) {
                    deleteFile(file.children)
                }
                addEditedFile(file.id , "file" , file , null , file.name)
                return
            }
            if ( file.children.length > 0) {
                file.children = deleteFolderRecursive(id, file.children)
            }
            temp.push(file)
        })
        return temp
    }

    function deleteFile(folder : Folder[]){
        folder.forEach(file => {
            if(file.children.length > 0){
                deleteFile(file.children)
            }

            addEditedFile(file.id , "file" , file , null , file.name )
        })
    }

    async function deleteFolderFile(id: string) {

        let updatedFolder = deleteFolderRecursive(id, folder)
        addEditedFolder(null, "folder" , JSON.stringify(folder) , JSON.stringify(updatedFolder) , null)
        clearList()
        convertIntoLinkedList(updatedFolder)

    }

    function renameFolder() {
        setRenameOpen(true)
        if (renameInputValue?.current) {
            renameInputValue.current!.focus()
        }
    }

    function rename(event: React.FormEvent, fileId: string) {
        event.preventDefault();
        setLoading(true)
        axiosInstance.post("/file/rename",
            {
                file_id: fileId,
                project_id: project?.Id,
                name: renameInputValue.current?.value
            }
        ).then(data => {
            setLoading(false)
            const res = data.data
            const json = JSON.parse(atob(res))
            setFolder(json)
            setRenameOpen(false)
            clearList()
            convertIntoLinkedList(json)
        })
    }

    return (
        <div className="my-1">
            {
                renameOpen ?
                    <form onSubmit={(e) => rename(e, child.id)} className="flex gap-1 items-center m-2 mx-1">
                        <Input className="flex-1 h-8" ref={renameInputValue} defaultValue={child.name}></Input>
                        <Button className="p-1 h-8 w-8" type="submit"><Check className="h-[16px]"></Check></Button>
                        <Button className="p-1 h-8 w-8" onClick={() => { setRenameOpen(false) }}><X className="h-[16px]"></X></Button>
                    </form> :
                    <div onClick={() => setSelectedFolder(child)} className={`flex w-full group items-center hover:cursor-pointer hover:bg-primary/10 p-1 px-2 rounded gap-2 transition-all text-muted-foreground hover:text-primary ${selectedFolder?.id === child.id ? "bg-primary/10" : ""} `}>
                        <div className=' transition-opacity flex'>
                            {
                                child.children.length > 0 && (
                                    <Button variant={"ghost"} className='p-0 h-[22px] w-[22px] hidden items-center justify-center group-hover:flex hover:bg-primary/10 rounded z-10 opacity-0 group-hover:opacity-100' onClick={openCloseAccordian}><ChevronRight height={18} width={18} className={`${open ? "rotate-90" : ""}`}></ChevronRight></Button>
                                )
                            }
                            <div className={`h-[22px] w-[22px] flex items-center justify-center ${child.children?.length !== 0 ? "group-hover:hidden" : ""}`}>{
                                child.children?.length === 0 ? (
                                    <File height={18} width={18} />
                                ) : (
                                    open ? <FileText height={18} width={18} /> : <FileText height={18} width={18} />
                                )
                            }</div>
                        </div>
                        <div className='flex-auto truncate flex items-center text-sm font-medium h-full'>
                            <div className='truncate'>
                                {child.name}
                            </div>
                        </div>
                        {
                            isEditing && <div className='group-hover:flex items-center justify-center shrink-0 grow-0 h-100'>
                                <div className='opacity-0 transition-opacity group-hover:opacity-100'>
                                    <div className='block absolute overflow-hidden whitespace-nowrap h-[0px] w-[0px] group-hover:flex group-hover:static group-hover:overflow-auto group-hover:whitespace-normal group-hover:h-full group-hover:w-full'>
                                        <div className='flex items-center justify-center h-full z-10'>
                                            <TooltipProvider delayDuration={200}>
                                                <Tooltip>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <TooltipTrigger className="h-[22px] overflow-hidden"><Button variant={"ghost"} className='p-1 h-[22px] w-[22px]  hover:bg-primary/10'><Ellipsis className="h-[14px] w-[14px]"></Ellipsis></Button></TooltipTrigger>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="flex flex-col w-48 p-1 gap-1">
                                                            <Item label="Rename" onClick={() => renameFolder} icon={SquarePen} className={"text-sm"}></Item>
                                                            <Item label="Delete" onClick={() => deleteFolderFile(child.id)} icon={Trash} className={"text-sm text-red-500"}></Item>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <TooltipContent side='bottom'>
                                                        <p>more</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger className="h-[22px] overflow-hidden"><Button variant={"ghost"} onClick={() => openNew()} className='p-1 h-[22px] w-[22px]  hover:bg-primary/10'><Plus className="h-[14px] w-[14px]"></Plus></Button></TooltipTrigger>
                                                    <TooltipContent side='bottom'>
                                                        <p>Create new file</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
            }

            {
                newFolder && (
                    <form onSubmit={() => addFileFolder(child.id)} className="flex gap-1 items-center m-2 mx-1">
                        <Input className="flex-1 h-8" ref={inputValue} ></Input>
                        <Button className="p-1 h-8 w-8" type="submit"><Check className="h-[16px]"></Check></Button>
                        <Button className="p-1 h-8 w-8" onClick={() => { setNewFolder(false) }}><X className="h-[16px]"></X></Button>
                    </form>
                )
            }

            {
                open && (
                    <div className='pl-2'>
                        {child.children.map((child: any, index: any) => (
                            <CustomAccordian key={index} child={child} />
                        ))}
                    </div>
                )
            }</div>

    );
};

export default CustomAccordian;
