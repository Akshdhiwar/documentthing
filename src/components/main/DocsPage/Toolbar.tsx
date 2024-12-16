import { Loader, SaveAll } from "lucide-react"
import { Button } from "../../ui/button"
import useFolderStore from "@/store/folderStore"
import useProjectStore from "@/store/projectStore"
import { useEffect, useRef, useState } from "react"
import BreadCrums from "./BreadCrums"
import useEditChangesStore from "@/store/changes"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ToastAction } from "@/components/ui/toast"
import useUserStore from "@/store/userStore"
import useDoublyLinkedListStore from "@/store/nextPreviousLinks"
import { useToast } from "@/components/ui/use-toast"
import { ResponsiveModal, ResponsiveModalTrigger, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsive-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import EditingSetup from "./EditingSetup"
import useBranchStore from "@/store/branch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import ToggleEditPreview from "./ToggleEditPreview"

const formSchema = z.object({
    message: z.string(),
    commitSelect: z.string(),
    prSwitch: z.boolean()
});


const Toolbar = () => {
    const axiosInstance = useAxiosWithToast()
    const [isLoading, setLoading] = useState(false)
    const project = useProjectStore(state => state.project)
    const { setFolder, setSelectedFolder, isNoFilePresent, Url } = useFolderStore(state => state)
    const { isEditing, editedFiles, reset, editedFolder, editedMarkdown } = useEditChangesStore(state => state)
    const { user } = useUserStore(state => state)
    const { convertIntoLinkedList, clearList } = useDoublyLinkedListStore(state => state)
    const webSocket = useRef<WebSocket | null>(null); // Use useRef to hold the WebSocket instance
    const { toast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { name } = useBranchStore(state => state)
    const [selectedBranch, setSelectedBranch] = useState<string>("main");
    const [activeTab, setActiveTab] = useState<string>("preview")

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

    useEffect(() => {
        if (!project?.Id) return;

        // Establish WebSocket connection when projectId is available
        webSocket.current = setupWebSocket(project.Id);

        // Clean up WebSocket on component unmount
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [project?.Id, isEditing]);

    function setupWebSocket(projectID: string) {

        const baseURL =
            import.meta.env.VITE_ENVIRONMENT === "Local"
                ? "ws://localhost:3000/api/v1"
                : "wss://betterdocs-backend-production.up.railway.app/api/v1" // Replace with your API base URL

        const ws = new WebSocket(`${baseURL}/project/${projectID}/updates`);

        // Handle incoming messages
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // If an update is received, show a success toast
            if (data.userID !== user?.ID) {
                toast({
                    variant: "default",
                    title: 'Someone in your team updated the document',
                    description: 'Click on refresh to get the latest document',
                    action: <ToastAction altText="refresh" onClick={() => getFolderJson()}>Refresh</ToastAction>
                });
            }
        };

        // Handle errors
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return ws;
    }

    function getFolderJson() {
        axiosInstance.get(`/folder/${project?.Id}/${user?.Type}`).then(data => {
            const res = data.data
            const json: Folder[] = JSON.parse(JSON.parse(atob(res)))
            setFolder(json)
            if (json.length > 0) {
                clearList()
                convertIntoLinkedList(json)
                setSelectedFolder(json[0])
            }
            setLoading(false)
        })
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
        <div className="flex flex-col">
            <div className="flex gap-2 items-center justify-between p-1 px-4 border-b border-gray-100 bg-sidebar">
                <SidebarTrigger></SidebarTrigger>
                <ToggleEditPreview activeTab={activeTab} setActiveTab={setActiveTab} setLoading={setLoading} ></ToggleEditPreview>
                {
                    project?.Role !== "Viewer" ? <>
                        {
                            isEditing ? <div className="flex gap-2">
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
                            </div> : <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={"sm"}>Publish</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>🚧 Publish to Internet is currently under development and will be available soon. Stay tuned!</p>
                                </TooltipContent>
                            </Tooltip>
                        }
                    </> : <div></div>
                }
            </div>
            <div className={`${!isNoFilePresent && Url && "p-1 px-4 border-b border-slate-100 truncate"}`}>
                {
                    !isNoFilePresent && Url && <BreadCrums UrlString={Url} />
                }
            </div>
        </div>
    )
}

export default Toolbar