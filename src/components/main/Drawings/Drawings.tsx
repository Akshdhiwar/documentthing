
import { Excalidraw } from "@excalidraw/excalidraw";
import CustomWelcomeScreen from "./CustomWelcomeScreen";
import CustomMainMenu from "./CustomMainMenu";
const Drawings = () => {
    return (
        <div className="h-dvh w-dvw">
            <Excalidraw >
                <CustomWelcomeScreen />
                <CustomMainMenu></CustomMainMenu>
            </Excalidraw>
        </div>
    )
}

export default Drawings