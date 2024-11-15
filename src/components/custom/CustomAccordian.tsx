import { Check, ChevronRight, Ellipsis, File, FileText, Plus, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import useFolderStore from "@/store/folderStore";
import useProjectStore from "@/store/projectStore";
import useDoublyLinkedListStore from "@/store/nextPreviousLinks";
import useEditChangesStore from "@/store/changes";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../ui/menubar";

interface FolderInterface {
    child: Folder
}

const CustomAccordian = ({ child }: FolderInterface) => {
    const axiosInstance = useAxiosWithToast()
    const inputValue = useRef<HTMLInputElement>(null)
    const renameInputValue = useRef<HTMLInputElement>(null)
    const [newFolder, setNewFolder] = useState(false)
    const [open, setOpen] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const project = useProjectStore(state => state.project)
    const { addPage, setFolder, setSelectedFolder, selectedFolder, setLoading, folder, Url } = useFolderStore(state => state)
    const { clearList, convertIntoLinkedList } = useDoublyLinkedListStore(state => state)
    const { isEditing, addEditedFile, addEditedFolder, addEditedMarkdown } = useEditChangesStore(state => state)
    let flag = false;


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
        let temp: Folder[] = []

        folder.forEach((file) => {
            if (file.id === id) {
                if (file.children.length > 0) {
                    flag = true
                    deleteFile(file.children)
                }
                addEditedFile(file.id, "file", file, null, file.name)
                return
            }
            if (file.children.length > 0) {
                file.children = deleteFolderRecursive(id, file.children)
            }
            temp.push(file)
        })
        return temp
    }

    function deleteFile(folder: Folder[]) {
        folder.forEach(file => {
            if (file.children.length > 0) {
                deleteFile(file.children)
            }

            addEditedFile(file.id, "file", file, null, file.name)
        })
    }

    async function deleteFolderFile(id: string) {

        let updatedFolder = deleteFolderRecursive(id, folder)
        addEditedFolder(null, "folder", JSON.stringify(folder), JSON.stringify(updatedFolder), null)
        if (flag) {
            addEditedMarkdown(id, "markdown", null, "null", null, Url.replace(/\s*\/\s*/, '/'))
        }
        addEditedMarkdown(id, "markdown", null, "null", null, Url.replace(/\s*\/\s*/, '/') + ".md")
        clearList()
        convertIntoLinkedList(updatedFolder)

    }

    // function renameFolder() {
    //     setRenameOpen(true)
    //     if (renameInputValue?.current) {
    //         renameInputValue.current!.focus()
    //     }
    // }

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
                    <div onClick={() => setSelectedFolder(child)} className={`h-[33px] flex w-full group items-center hover:cursor-pointer hover:bg-sidebar-accent p-1 px-2 rounded gap-2 transition-all text-muted-foreground hover:text-primary ${selectedFolder?.id === child.id ? "bg-sidebar-accent" : ""} `}>
                        <div className=' transition-opacity flex'>
                            {
                                child.children.length > 0 && (
                                    <Button variant={"ghost"} className='p-0 h-[22px] w-[22px] flex items-center justify-center  rounded z-10' onClick={openCloseAccordian}><ChevronRight height={18} width={18} className={`${open ? "rotate-90" : ""}`}></ChevronRight></Button>
                                )
                            }
                            <div className={`h-[22px] w-[22px] flex items-center justify-center ${child.children?.length === 0 ? "" : "hidden"}`}>{
                                child.children?.length === 0 && (
                                    <File height={18} width={18} />
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
                                            <Menubar className="h-min p-0">
                                                <MenubarMenu>
                                                    <MenubarTrigger className='p-1 h-[22px] w-[22px]  hover:bg-sidebar-accent'><Ellipsis className="h-[14px] w-[14px]"></Ellipsis></MenubarTrigger>
                                                    <MenubarContent className="flex flex-col w-48 p-1 gap-1" side="right">
                                                        <MenubarItem onClick={() => openNew()}>
                                                            <div className="flex gap-2 items-center">
                                                                <Plus className="h-[18px]"></Plus> Create Sub-file
                                                            </div>
                                                        </MenubarItem>
                                                        <MenubarItem onClick={() => deleteFolderFile(child.id)}>
                                                            <div className="flex gap-2 items-center">
                                                                <Trash className="h-[18px]"></Trash> Delete
                                                            </div>
                                                        </MenubarItem>
                                                        {/* <Item label="Rename" onClick={() => renameFolder} icon={SquarePen} className={"text-sm"}></Item> */}
                                                        {/* <Item label="Delete" onClick={() => deleteFolderFile(child.id)} icon={Trash} className={"text-sm text-red-500"}></Item> */}
                                                    </MenubarContent>
                                                </MenubarMenu>
                                            </Menubar>
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
