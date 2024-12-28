import { exportToSvg, MainMenu } from "@excalidraw/excalidraw"
import { ChevronsLeft, Github } from "lucide-react"
import React from "react";
import { useNavigate } from "react-router-dom"

type CustomMenuInterface = {
    excalidrawApi: any;
}

const CustomMainMenu: React.FC<CustomMenuInterface> = ({ excalidrawApi }) => {

    const navigate = useNavigate()

    const goToDashboard = () => {
        navigate("/dashboard")
    }

    return (
        <MainMenu>
            <MainMenu.Item onSelect={() => { goToDashboard() }} icon={<ChevronsLeft></ChevronsLeft>}>
                Go to dashboard
            </MainMenu.Item>
            <MainMenu.Group title="File">
                <MainMenu.DefaultItems.LoadScene />
            </MainMenu.Group>
            <MainMenu.Separator></MainMenu.Separator>
            <MainMenu.Group title="Save">
                <MainMenu.Item onSelect={async () => {
                    if (!excalidrawApi) {
                        return
                    }
                    
                    // console.log(excalidrawApi.getSceneElements())
                    // const svg = await exportToSvg({
                    //     elements: excalidrawApi.getSceneElements(),
                    //     files: excalidrawApi?.getFiles()
                    // })
                    // console.log(svg);

                }} icon={<Github></Github>}>
                    Save to Github
                </MainMenu.Item>
                <MainMenu.DefaultItems.Export />
                <MainMenu.DefaultItems.SaveAsImage />
            </MainMenu.Group>
            <MainMenu.Separator></MainMenu.Separator>
            <MainMenu.Group title="Others">
                {/* <MainMenu.DefaultItems.SaveToActiveFile /> */}
                <MainMenu.DefaultItems.Help />
                <MainMenu.DefaultItems.ClearCanvas />
                <MainMenu.DefaultItems.ToggleTheme />
            </MainMenu.Group>
            <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
    )
}

export default CustomMainMenu