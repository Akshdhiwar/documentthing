import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import useBranchStore from "@/store/branch";
import useEditChangesStore from "@/store/changes";
import useProjectStore from "@/store/projectStore";

type ToggleInterface = {
    activeTab: string,
    setActiveTab: (tab: string) => void,
    setLoading: (val: boolean) => void,
}

const ToggleEditPreview: React.FC<ToggleInterface> = ({ activeTab, setActiveTab, setLoading }) => {
    const project = useProjectStore(state => state.project)
    const { setIsEditing, reset } = useEditChangesStore(state => state)
    const { name, setName } = useBranchStore(state => state)
    const axiosInstance = useAxiosWithToast()

    function onTabChange(value: string) {
        console.log(value)
        if (value === "preview") {
            cancelEditing();
            return
        }
        setIsEditing(value === "edit")
        setActiveTab(value);
    }

    function cancelEditing() {
        reset()
        setActiveTab("preview")
        setLoading(false)
        deleteBranch()
    }

    function deleteBranch() {
        if (name) {
            axiosInstance.delete(`/branch/${project?.Id}/${name}`).then(() => {
                setName("")
            })
        } else {
            setActiveTab("edit")
        }
    }

    return (
        <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                {
                    project?.Role !== "Viewer" && <TabsTrigger value="edit">Edit Mode</TabsTrigger>
                }
            </TabsList>
        </Tabs>
    )
}

export default ToggleEditPreview