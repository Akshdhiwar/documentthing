import FolderProvider from "@/provider/FolderProvider"
import NavigationSideBar from "../main/NavigationSideBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import Toolbar from "../main/Toolbar"
import EditorProvider from "@/provider/EditorProvider"
import Editor from "../main/Editor"

const DocsPage = () => {
    return (
        <FolderProvider>
            <ResizablePanelGroup
                direction="horizontal"
            >
                <ResizablePanel maxSize={25} defaultSize={15} minSize={15} className="hidden md:flex">
                    <NavigationSideBar />
                </ResizablePanel>
                <ResizableHandle withHandle className="hidden md:flex" />
                <ResizablePanel defaultSize={75}>
                    <EditorProvider>
                        <div className="flex flex-col h-full">
                            <div>
                                <Toolbar></Toolbar>
                            </div>
                            <div className="flex justify-center mt-6 flex-1 overflow-auto">
                                <div className="w-full max-w-3xl ">
                                    <Editor />
                                    {/* <BlockEditor/> */}
                                </div>
                            </div>
                        </div>
                    </EditorProvider>
                </ResizablePanel>
            </ResizablePanelGroup>
        </FolderProvider>
    )
}

export default DocsPage