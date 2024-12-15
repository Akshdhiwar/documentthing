import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useEditChangesStore from "@/store/changes"
import { useEffect } from "react"
import useProjectStore from "@/store/projectStore"
import useUserStore from "@/store/userStore"
import useBranchStore from "@/store/branch"

type EditingSetupInterface = {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

function getRandomNumber() {
    return Math.floor(Math.random() * 999) + 1;
}

const EditingSetup: React.FC<EditingSetupInterface> = ({ }) => {
    const axiosInstance = useAxiosWithToast()
    const { isEditing } = useEditChangesStore(state => state)
    const { project } = useProjectStore(state => state)
    const { user } = useUserStore(state => state)
    const { setName } = useBranchStore(state => state)

    useEffect(() => {

        if (isEditing) {
            console.log("create")
            createBranch()
        }

    }, [])

    function getDate() {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        console.log(formattedDate); // Output: YYYY-MM-DD
        return formattedDate;
    }

    function createBranch() {
        let branchName = user?.GithubName + "_" + getDate() + "_" + getRandomNumber() + "_" + "changes"
        setName(branchName)
        axiosInstance.post("/branch", {
            project_id: project?.Id,
            branch_name: branchName
        })
    }

    // function deleteBranch() {
    //     axiosInstance.delete(`/branch/${project?.Id}/${name}`).then(() => {
    //         setName("")
    //     }).catch(() => {
    //         // get back to editing mode
    //         setActiveTab("edit")
    //     })
    // }

    return (
        <></>
    )
}

export default EditingSetup