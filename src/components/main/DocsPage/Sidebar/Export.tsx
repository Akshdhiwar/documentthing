import useEditorStore from "@/store/editorStore"
import useFolderStore from "@/store/folderStore"
import { BookMarked, Download, FileCode2 } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { html, markdown } from "@yoopta/exports"

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

    function exportFile(value: "Markdown" | "HTML") {
        if (value === "Markdown") {
            exportMarkdown()
        } else {
            exportHTML()
        }
    }
    async function exportHTML() {
        const data = editor.getEditorValue();
        const htmlString = html.serialize(editor, data);
        downloadFile(htmlString, folder?.name + ".html", "text/html");
    }
    async function exportMarkdown() {
        const data = editor.getEditorValue();
        const markdownString = markdown.serialize(editor, data);
        downloadFile(markdownString, folder?.name + ".md", "text/markdown");
    }

    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-min"
                    >
                        <Download></Download>
                        Export
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={"bottom"}
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Export selected page
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => { exportFile("HTML") }}>
                            <FileCode2 />
                            Export as Html
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => { exportFile("Markdown") }}>
                            <BookMarked />
                            Export as markdown
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}

export default Export