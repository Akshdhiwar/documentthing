import useEditorStore from "@/store/editorStore"
import useFolderStore from "@/store/folderStore"
import { BookMarked, Download, FileCode2, FileUp } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { html, markdown } from "@yoopta/exports"
import useEditChangesStore from "@/store/changes"
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from "@/components/ui/responsive-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import React, { useState } from "react"

const Export = () => {
    const editor = useEditorStore(state => state.editor)
    const folder = useFolderStore(state => state.selectedFolder)
    const { isEditing } = useEditChangesStore(state => state)
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialog2, setOpenDialog2] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

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

    function importDocs() {
        document.getElementById("fileInput")?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get the input element
        const inputElement = event.target;

        // Access the selected files
        const files = inputElement.files;

        if (files && files.length > 0) {
            const selectedFile = files[0]; // Get the first file
            console.log("Selected file:", selectedFile.name);
            if (selectedFile) {
                const allowedExtensions = ["html", "md"]; // Allowed file extensions
                const fileName = selectedFile?.name ?? ""; // Default to an empty string if undefined
                const fileExtension = fileName.split(".").pop() || ""; // Safely get the extension

                console.log("File extension:", fileExtension);

                if (!allowedExtensions.includes(fileExtension)) {
                    alert("Please select a .html or .md file.");
                    return;
                }

                const text = await selectedFile.text()
                console.log(text);

                if (fileExtension === "html") {
                    const content = html.deserialize(editor, text);
                    editor.setEditorValue(content);
                } else if (fileExtension === "md") {
                    const value = markdown.deserialize(editor, text);
                    editor.setEditorValue(value);
                }
            }
        } else {
            console.log("No file selected.");
        }
    };

    return (
        <div>
            {
                isEditing && <SidebarMenuItem>
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-min"
                            >
                                <FileUp></FileUp>Import
                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: "none" }}
                                    accept=".html,.md"
                                    onChange={handleFileSelect}
                                />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={"bottom"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Import
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => importDocs()}>
                                    <FileUp></FileUp>Import File
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Modal type="HTML" openDialog={openDialog} setOpenDialog={setOpenDialog} placholder="<h1>Hi my name is Akash</h1>" setDropdown={setDropdownOpen}></Modal>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <Modal type="Markdown" openDialog={openDialog2} setOpenDialog={setOpenDialog2} placholder="# Hello My name is Akash" setDropdown={setDropdownOpen}></Modal>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            }
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
        </div>
    )
}

const formSchema = z.object({
    content: z.string()
});

type ModalInterface = {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    setDropdown: (open: boolean) => void;
    placholder: string
    type: string
}
const Modal: React.FC<ModalInterface> = ({ openDialog, setOpenDialog, placholder, type, setDropdown }) => {

    const editor = useEditorStore(state => state.editor)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            if (type == "HTML") {
                const content = html.deserialize(editor, values.content);
                editor.setEditorValue(content);
            } else if (type == "Markdown") {
                const value = markdown.deserialize(editor, values.content);
                editor.setEditorValue(value);
            }
            setOpenDialog(false);
            setDropdown(false);
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    return (<ResponsiveModal open={openDialog} onOpenChange={setOpenDialog}>
        <ResponsiveModalTrigger asChild>
            <DropdownMenuItem onSelect={(e) => {
                e.preventDefault()
            }}>
                <BookMarked />
                Type and Import {type}
            </DropdownMenuItem>
        </ResponsiveModalTrigger>
        <ResponsiveModalContent side={"bottom"}>
            <ResponsiveModalHeader>
                <ResponsiveModalTitle>Invite Team-mate</ResponsiveModalTitle>
                <ResponsiveModalDescription>
                    Add their gmail address to get the invite link
                </ResponsiveModalDescription>
            </ResponsiveModalHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-5">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{type} Elements</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={placholder}
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Enter the content in {type} to import</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModalContent>
    </ResponsiveModal>)
}

export default Export