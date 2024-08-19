
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable"
import Toolbar from "../components/main/Toolbar"
// import { lazy } from "react"
import NavigationSideBar from "@/components/main/NavigationSideBar"
import Editor from "@/components/main/YooptaEditor"

const DocsPage = () => {

    // const NavigationSideBar = lazy(() => import('../components/main/NavigationSideBar'))
    // const Editor = lazy(() => import("../components/main/YooptaEditor"))

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
                    <div className="flex justify-center mt-6 flex-1 overflow-auto">
                        <div className="w-full max-w-3xl ">
                            <Editor />
                            {/* <BlockEditor/> */}
                        </div>
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default DocsPage