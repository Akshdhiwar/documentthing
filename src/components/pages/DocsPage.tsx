import FolderProvider from "@/provider/FolderProvider"
import NavigationSideBar from "../main/NavigationSideBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import BlockEditor from "../main/BlockEditor"

const DocsPage = () => {
    return (
        <FolderProvider>
            <ResizablePanelGroup
                direction="horizontal"
            >
                <ResizablePanel maxSize={25} defaultSize={15} minSize={15}>
                    <NavigationSideBar />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className="flex h-full p-6 pb-0 w-full">
                        <BlockEditor/>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </FolderProvider>
    )
}

export default DocsPage