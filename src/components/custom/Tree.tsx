import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '../ui/sidebar'
import { ChevronRight, File, Folder, MoreHorizontal } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import useFolderStore from '@/store/folderStore'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import useEditChangesStore from '@/store/changes'
import useDoublyLinkedListStore from '@/store/nextPreviousLinks'
import useAddFolderContext from '@/shared/custom hooks/useDialogContext'
interface FolderInterface {
    item: Folder
}
function Tree({ item }: FolderInterface) {
    const { folder, Url, selectedFolder, setSelectedFolder } = useFolderStore(state => state)
    const { addEditedFile, addEditedFolder, addEditedMarkdown, isEditing } = useEditChangesStore(state => state)
    const { clearList, convertIntoLinkedList } = useDoublyLinkedListStore(state => state)
    let flag = false;
    const addPage = useAddFolderContext()

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

    function AddNewPage() {
        addPage.setId(item.id)
        addPage.open()
    }

    if (!item.children.length) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton isActive={selectedFolder?.id === item.id} onClick={() => setSelectedFolder(item)}
                >
                    <File />
                    <Tooltip>
                        <TooltipTrigger>
                            <div className='flex flex-1 basis-0 truncate'>
                                {item.name}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p> {item.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </SidebarMenuButton>
                {
                    isEditing && <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                                <MoreHorizontal />
                            </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); AddNewPage() }}>
                                <span>Add Page</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteFolderFile(item.id)}>
                                <span>Delete Page</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>li>button:first-child>svg:first-child]:rotate-90"
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive={selectedFolder?.id === item.id} onClick={() => setSelectedFolder(item)}>
                            <ChevronRight className="transition-transform" />
                            <Folder />
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className='flex flex-1 basis-0 truncate'>
                                        {item.name}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p> {item.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </SidebarMenuButton>
                        {
                            isEditing && <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction>
                                        <MoreHorizontal />
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" align="start">
                                    <DropdownMenuItem onClick={() => AddNewPage()}>
                                        <span>Add Page</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteFolderFile(item.id)}>
                                        <span>Delete Group</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        }
                    </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className=' mr-0 pr-0'>
                        {item.children.map((subItem, index) => (
                            <Tree key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}

export default Tree