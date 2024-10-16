import Item from "@/components/custom/Item"
import { Button } from "@/components/ui/button"
import useEditorStore from "@/store/editorStore"
import useFolderStore from "@/store/folderStore"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { ChevronDown, CodeXml } from "lucide-react"
import { useState } from "react"
import { PopoverClose } from "@radix-ui/react-popover";

const Export = () => {
    const [type, setType] = useState<"Markdown" | "HTML">("Markdown")
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

    function exportFile() {
        if (type === "Markdown") {
            exportMarkdown()
        } else {
            exportHTML()
        }
    }
    async function exportHTML() {
        const htmlString = await editor.blocksToHTMLLossy(editor.document)
        downloadFile(htmlString, folder?.name + ".html", "text/html");
    }
    async function exportMarkdown() {
        const markdownString = await editor.blocksToMarkdownLossy(editor.document)
        downloadFile(markdownString, folder?.name + ".md", "text/markdown");
    }

    return (
        <div className="flex items-center gap-[1px]">
            <Button onClick={exportFile} size={"sm"} className="rounded-none rounded-tl-md rounded-bl-md" >Export {type}</Button>
            <Popover>
                <PopoverTrigger>
                    <Button className="h-9 w-6 rounded-none rounded-tr-md rounded-br-md" size={"icon"}><ChevronDown height={16} width={16} /></Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col w-48 p-1 gap-1 z-20 border mt-2 rounded-sm bg-white">
                    <PopoverClose>
                        <Item label="HTML" onClick={() => { setType("HTML") }} icon={CodeXml} className="text-sm"></Item>
                    </PopoverClose>
                    <PopoverClose>
                        <Item label="Markdown" onClick={() => { setType("Markdown") }} icon={CodeXml} className="text-sm"></Item>
                    </PopoverClose>
                </PopoverContent>
            </Popover>
        </div>

    )
}

export default Export