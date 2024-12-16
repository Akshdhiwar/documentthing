import { ResponsiveModal, ResponsiveModalTrigger, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsive-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { Loader, SaveAll } from "lucide-react";
import EditingSetup from "./EditingSetup";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import useEditChangesStore from "@/store/changes";
import useBranchStore from "@/store/branch";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import useUserStore from "@/store/userStore";
import useProjectStore from "@/store/projectStore";

const formSchema = z.object({
    message: z.string(),
    commitSelect: z.string(),
    prSwitch: z.boolean()
});

type SaveInterface = {
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
    webSocket: React.RefObject<WebSocket | null>;
}

const Save: React.FC<SaveInterface> = ({ isLoading, setLoading, setActiveTab, webSocket }) => {
    const axiosInstance = useAxiosWithToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<string>("main");
    const { editedFiles, reset, editedFolder, editedMarkdown } = useEditChangesStore(state => state)
    const { name } = useBranchStore(state => state)
    const { user } = useUserStore(state => state)
    const project = useProjectStore(state => state.project)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
            commitSelect: "main",
            prSwitch: false
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            onSaveToServer(values.message, values.commitSelect, values.prSwitch)
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    const onSaveToServer = async (message: string, branchName: string, prBool: boolean) => {
        setLoading(true)

        let files = editedFiles.map(file => {
            if (file.changedContent !== file.originalContent) {
                return {
                    ...file,
                    changedContent: JSON.stringify(file.changedContent!),
                    originalContent: JSON.stringify(file.originalContent!)
                }
            }
        }).filter(file => file !== undefined); // Remove undefined values

        let folder = editedFolder.map(folder => {
            return {
                ...folder,
                changedContent: JSON.stringify(folder.changedContent!),
                originalContent: JSON.stringify(folder.originalContent!)
            }
        }).filter(file => file !== undefined); // Remove undefined values

        let markdown = editedMarkdown.map(file => {
            return {
                ...file,
                originalContent: JSON.stringify(file.originalContent!)
            }
        }).filter(file => file !== undefined); // Remove undefined values

        // setLoading(true)
        let response = await axiosInstance.post("/commit/edits", {
            project_id: project?.Id,
            content: [...files, ...folder, ...markdown],
            message: message + " - " + user?.GithubName,
            branch_name: branchName,
            pr: branchName === "main" ? false : prBool
        })

        if (response.status === 200) {
            setLoading(false)
            reset()
            setActiveTab("preview")
            // Make sure the WebSocket is open before trying to send a message
            if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
                webSocket.current.send(JSON.stringify({
                    userID: user?.ID,
                    message: "Updated document"
                }));
            }
        } else {
            setLoading(false)
        }

        setIsModalOpen(false)

        // const editorContent = editor.getEditorValue();
        // await fetchToServer(JSON.stringify(editorContent))
    }

    return (
        <div className="flex gap-2">
            <ResponsiveModal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <ResponsiveModalTrigger asChild>
                    <Button size={"sm"} className="flex gap-2" disabled={editedFiles.length === 0 || isLoading}>{
                        isLoading ? <Loader className="animate-spin" height={18} width={18}></Loader> : <SaveAll height={18} width={18}></SaveAll>
                    } Save </Button>
                </ResponsiveModalTrigger>
                <ResponsiveModalContent side={"bottom"}>
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>Commit Message</ResponsiveModalTitle>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-5">
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mesasge</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Updated the login module documentation"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>The commit mesasge that will be displayed on github</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="commitSelect"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Commit branch</FormLabel>
                                            <Select onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedBranch(value); // Update state
                                            }} defaultValue="main">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Branch" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="main">Main Branch</SelectItem>
                                                    <SelectItem value={name}>{name} Branch</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select the branch you want to commit to.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="prSwitch"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Raise PR?</FormLabel>
                                                <FormDescription>The the pr for specific branch that you have selected</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    onCheckedChange={field.onChange}
                                                    disabled={selectedBranch === "main"}
                                                    aria-readonly
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>{
                                        isLoading ? <Loader className="animate-spin" height={18} width={18}></Loader> : <SaveAll height={18} width={18}></SaveAll>
                                    }Commit and Save</Button>
                                </div>
                            </form>
                        </Form>
                    </ResponsiveModalHeader>
                </ResponsiveModalContent>
            </ResponsiveModal>
            <EditingSetup></EditingSetup>
        </div>
    )
}

export default Save