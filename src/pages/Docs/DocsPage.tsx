import Toolbar from "../../components/main/DocsPage/Toolbar"
import NavigationSideBar from "@/components/main/DocsPage/NavigationSideBar"
import NextPrevious from "@/components/main/DocsPage/NextPrevious"
import useFolderStore from "@/store/folderStore"
import BlockNoteEditor from "@/components/main/DocsPage/BlockNoteEditor"
import CustomAlert from "@/components/custom/CustomAlert"
import useEditChangesStore from "@/store/changes"
import React, { useEffect } from "react"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ScrollArea } from "@radix-ui/react-scroll-area"

const DocsPage = () => {

    const isNoFilePresent = useFolderStore(state => state.isNoFilePresent)
    const { isEditing } = useEditChangesStore(state => state)
    const clearLinkList = useDoublyLinkedListStore(state => state.clearList)
    const { selectedFolder } = useFolderStore(state => state)
    useEffect(() => {
        return () => {
            clearLinkList()
            useFolderStore.getState().setIsNoFilePresent(false)
            useFolderStore.getState().setFolder([])
        }
    }, [])

    return (
        <SidebarProvider style={{
            "--sidebar-width": "25rem"
        } as React.CSSProperties}>
            <NavigationSideBar />
            <ScrollArea className="flex flex-col flex-1 relative">
                <div className="sticky top-0 z-10 bg-white">
                    <Toolbar></Toolbar>
                </div>
                <div className="flex justify-center pt-6 p-3 flex-1">
                    {
                        !isNoFilePresent && <div className="w-full max-w-3xl h-full flex-1 basis-auto flex flex-col justify-between">
                            {
                                isEditing && <CustomAlert type="warning" title='' hideTitle={true}>
                                    Please avoid making unnecessary changes to the document. Before saving, ensure you review all your changes carefully to keep the document up-to-date and accurate.
                                </CustomAlert>
                            }
                            {
                                selectedFolder && <div className="flex-1 flex flex-col pt-4 justify-between">
                                    <BlockNoteEditor />
                                    <NextPrevious />
                                </div>
                            }
                        </div>
                    }
                </div>
            </ScrollArea>
        </SidebarProvider>
    )
}

export default DocsPage