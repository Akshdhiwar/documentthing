import { WelcomeScreen } from "@excalidraw/excalidraw"


const CustomWelcomeScreen = () => {
    return (
        <WelcomeScreen >
            <WelcomeScreen.Center>
                <WelcomeScreen.Center.Logo>
                    {/* add your logo here */}
                </WelcomeScreen.Center.Logo>
                <WelcomeScreen.Center.Heading>
                    Diagrams. Made. Simple. access all at github.
                </WelcomeScreen.Center.Heading>
                <WelcomeScreen.Center.Menu>
                    <WelcomeScreen.Center.MenuItemLoadScene></WelcomeScreen.Center.MenuItemLoadScene>
                    <WelcomeScreen.Center.MenuItemHelp></WelcomeScreen.Center.MenuItemHelp>
                </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>
            <WelcomeScreen.Hints.HelpHint></WelcomeScreen.Hints.HelpHint>
            <WelcomeScreen.Hints.ToolbarHint></WelcomeScreen.Hints.ToolbarHint>
            <WelcomeScreen.Hints.MenuHint></WelcomeScreen.Hints.MenuHint>
        </WelcomeScreen>
    )
}

export default CustomWelcomeScreen