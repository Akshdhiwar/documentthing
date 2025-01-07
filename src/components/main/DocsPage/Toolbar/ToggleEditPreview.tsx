import { Button } from "@/components/ui/button";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsive-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import useBranchStore from "@/store/branch";
import useEditChangesStore from "@/store/changes";
import useProjectStore from "@/store/projectStore";
import { useEffect, useState } from "react";

type ToggleInterface = {
    activeTab: string,
    setActiveTab: (tab: string) => void,
}

const ToggleEditPreview: React.FC<ToggleInterface> = ({ activeTab, setActiveTab }) => {
    const project = useProjectStore(state => state.project)
    const { setIsEditing, reset, editedFiles, editedFolder } = useEditChangesStore(state => state)
    const { name, setName } = useBranchStore(state => state)
    const axiosInstance = useAxiosWithToast()
    const [deleteBarnchDialog, setDeleteBranchDialog] = useState(false)
    const { isEditing } = useEditChangesStore(state => state)

    useEffect(() => {
        if (isEditing) {
            onTabChange("edit")
        }
    }, [])

    function onTabChange(value: string) {
        if (value === "preview" && (editedFiles.length > 0 || editedFolder.length > 0)) {
            setDeleteBranchDialog(true)
            return
        }
        setIsEditing(value === "edit")
        setActiveTab(value);
    }

    function cancelEditing() {
        reset()
        setActiveTab("preview")
        setDeleteBranchDialog(false)
        deleteBranch()
    }

    function deleteBranch() {
        if (name) {
            axiosInstance.delete(`/branch/${project?.Id}/${name}`).then(() => {
                setName("")
            })
        }
    }

    return (
        <>
            <Tabs value={activeTab} onValueChange={onTabChange}>
                <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    {
                        project?.Role !== "Viewer" && <TabsTrigger value="edit">Edit Mode</TabsTrigger>
                    }
                </TabsList>
            </Tabs>
            <ResponsiveModal open={deleteBarnchDialog} onOpenChange={setDeleteBranchDialog}>
                <ResponsiveModalContent side={"bottom"}>
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>Unsaved Changes Detected</ResponsiveModalTitle>
                        <ResponsiveModalDescription>
                            You have unsaved changes in your document. Deleting will discard all changes permanently. Are you sure you want to proceed?
                        </ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                    <Button size={"sm"} variant={"destructive"} onClick={cancelEditing}>Delete Editing Branch</Button>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    )
}

export default ToggleEditPreview