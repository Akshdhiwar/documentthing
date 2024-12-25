import { MainMenu } from "@excalidraw/excalidraw"
import { Github } from "lucide-react"

const CustomMainMenu = () => {
    return (
        <MainMenu>
            <MainMenu.Group title="File">
                <MainMenu.DefaultItems.LoadScene />
            </MainMenu.Group>
            <MainMenu.Separator></MainMenu.Separator>
            <MainMenu.Group title="Save">
                <MainMenu.Item onSelect={()=>{}} icon={<Github></Github>}>
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