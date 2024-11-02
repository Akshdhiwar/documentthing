
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable"
import Toolbar from "../../components/main/DocsPage/Toolbar"
import NavigationSideBar from "@/components/main/DocsPage/NavigationSideBar"
import NextPrevious from "@/components/main/DocsPage/NextPrevious"
import useFolderStore from "@/store/folderStore"
import BlockNoteEditor from "@/components/main/DocsPage/BlockNoteEditor"
import CustomAlert from "@/components/custom/CustomAlert"
import useEditChangesStore from "@/store/changes"
import { useEffect } from "react"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"

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
        <ResizablePanelGroup
            direction="horizontal"
        >
            <ResizablePanel maxSize={25} defaultSize={15} minSize={15} className="hidden md:flex">
                <NavigationSideBar />
            </ResizablePanel>
            <ResizableHandle withHandle className="hidden md:flex" />
            <ResizablePanel defaultSize={75}>
                <div className="flex flex-col h-full">
                    <div>
                        <Toolbar></Toolbar>
                    </div>
                    <div className="flex justify-center mt-6 flex-1  overflow-auto">
                        {
                            !isNoFilePresent && <div className="w-full max-w-3xl h-full flex-1 basis-auto flex flex-col justify-between">
                                {
                                    isEditing && <CustomAlert type="warning" title='' hideTitle={true}>
                                        Please avoid making unnecessary changes to the document. Before saving, ensure you review all your changes carefully to keep the document up-to-date and accurate.
                                    </CustomAlert>
                                }
                                {
                                    selectedFolder && <div className="flex-1 flex flex-col justify-between">
                                        <BlockNoteEditor />
                                        <NextPrevious />
                                    </div>
                                }

                            </div>
                        }
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default DocsPage