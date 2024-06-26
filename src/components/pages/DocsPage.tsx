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
                    <div className="flex flex-col h-full">
                        <div className="flex md:hidden">
                            <Toolbar></Toolbar>
                        </div>
                        <div className="flex justify-center mt-6 flex-1 overflow-auto">
                            <div className="w-full max-w-3xl ">
                                <BlockEditor />
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </FolderProvider>
    )
}

export default DocsPage