import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import useEditorStore from "@/store/editorStore"
import useFolderStore from "@/store/folderStore"
import {plainText , markdown , html} from "@yoopta/exports"

const Export = () => {

    const editor = useEditorStore(state => state.editor)
    const folder = useFolderStore(state => state.selectedFolder)

    // Function to download file
    const downloadFile = (content: string, fileName: string, fileType: string) => {
        const blob = new Blob([content], { type: fileType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };

    function exportPlainText() {
        const data = editor.getEditorValue();
        const textString = plainText.serialize(editor, data);
        downloadFile(textString, folder?.name + ".txt", "text/plain");
    }
    function exportHTML() {
        const data = editor.getEditorValue();
        const htmlString = html.serialize(editor, data);
        downloadFile(htmlString, folder?.name + ".html", "text/html");
    }
    function exportMarkdown() {
        const data = editor.getEditorValue();
        const markdownString = markdown.serialize(editor, data);
        downloadFile(markdownString, folder?.name + ".md", "text/markdown");
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Export</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="flex flex-col gap-1 p-2">
                            <Button variant={"ghost"} size={"sm"} onClick={exportPlainText}>Plain Text</Button>
                            <Button variant={"ghost"} size={"sm"} onClick={exportHTML}>HTML</Button>
                            <Button variant={"ghost"} size={"sm"} onClick={exportMarkdown}>Markdown</Button>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    )
}

export default Export