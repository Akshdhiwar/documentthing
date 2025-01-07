import Toolbar from "../../components/main/DocsPage/Toolbar/Toolbar"
import NavigationSideBar from "@/components/main/DocsPage/Sidebar/NavigationSideBar"
import NextPrevious from "@/components/main/DocsPage/Editor/NextPrevious"
import useFolderStore from "@/store/folderStore"
import CustomAlert from "@/components/custom/CustomAlert"
import useEditChangesStore from "@/store/changes"
import React, { useEffect, useState } from "react"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { AddFolderProvider } from "@/store/addFolder.context"
import Editor from "@/components/main/DocsPage/Editor/YooptaEditor"
import { TrackPageView } from "@/shared/utils/GoogleAnalytics"
import ContentSideBar from "@/components/main/DocsPage/Editor/ContentSideBar"
import Loader from "@/shared/components/Loader"

const DocsPage = () => {

    const isNoFilePresent = useFolderStore(state => state.isNoFilePresent)
    const { isEditing } = useEditChangesStore(state => state)
    const clearLinkList = useDoublyLinkedListStore(state => state.clearList)
    const { selectedFolder } = useFolderStore(state => state)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        TrackPageView()
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
            <AddFolderProvider>
                <NavigationSideBar />
            </AddFolderProvider>
            <ScrollArea className={`flex flex-col flex-1 relative`}>
                <div className="sticky top-0 z-10 bg-white">
                    <Toolbar></Toolbar>
                </div>
                <div className={`grid grid-cols-4 pt-6 p-3 flex-1 relative`}>
                    <div className="w-full flex-1 col-span-4 lg:col-span-3 flex justify-center">
                        {
                            !isNoFilePresent && <div className="w-full max-w-3xl h-full flex-1 basis-auto flex flex-col justify-between">
                                {
                                    isEditing && <CustomAlert type="warning" title='' hideTitle={true}>
                                        Please avoid making unnecessary changes to the document. Before saving, ensure you review all your changes carefully to keep the document up-to-date and accurate.
                                    </CustomAlert>
                                }
                                {
                                    selectedFolder && <div className="flex-1 flex flex-col pt-4 justify-between">
                                        <Editor setIsLoading={setIsLoading} />
                                        <NextPrevious />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    <div className="sticky top-[100px] w-full z-20 h-min hidden lg:block">
                        {
                            !isEditing &&
                            // <div>
                            <ScrollArea style={{ maxHeight: "calc(100vh - 120px)" }} className="overflow-y-auto">
                                <ContentSideBar />
                            </ScrollArea>
                            // </div>
                        }
                    </div>
                </div>
                {
                    isLoading && <div className='absolute w-full z-30 h-full top-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition'>
                        <div className="h-full relative">
                            <div className="sticky top-8 flex items-center justify-center">
                                <Loader></Loader>
                            </div>
                        </div>
                    </div>
                }
            </ScrollArea>
        </SidebarProvider>
    )
}

export default DocsPage