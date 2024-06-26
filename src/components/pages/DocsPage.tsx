import FolderProvider from "@/provider/FolderProvider"
import NavigationSideBar from "../main/NavigationSideBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import BlockEditor from "../main/BlockEditor"
import Toolbar from "../main/Toolbar"

const DocsPage = () => {
    return (
        <FolderProvider>
            <ResizablePanelGroup
                direction="horizontal"
            >
                <ResizablePanel maxSize={25} defaultSize={15} minSize={15} className="hidden md:flex">
                    <NavigationSideBar />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className="flex md:hidden">
                        <Toolbar></Toolbar>
                    </div>
                    <div className="flex flex-col items-center h-full p-6 pb-0 justify-center">
                        <div className="max-w-3xl w-full flex-1">
                            <BlockEditor />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </FolderProvider>
    )
}

export default DocsPage