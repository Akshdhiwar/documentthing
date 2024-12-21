import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useEditChangesStore from "@/store/changes"
import { useEffect } from "react"
import useProjectStore from "@/store/projectStore"
import useUserStore from "@/store/userStore"
import useBranchStore from "@/store/branch"

function getRandomNumber() {
    return Math.floor(Math.random() * 999) + 1;
}

const EditingSetup = ({ }) => {
    const axiosInstance = useAxiosWithToast()
    const { isEditing } = useEditChangesStore(state => state)
    const { project } = useProjectStore(state => state)
    const { user } = useUserStore(state => state)
    const { setName } = useBranchStore(state => state)

    useEffect(() => {

        if (isEditing) {
            createBranch()
        }

    }, [])

    function getDate() {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        return formattedDate;
    }

    async function createBranch() {

        const existingBranchName = await axiosInstance.get(`/branch/check/${project?.Id}`).then(res => {
            return res.data.branch_name
        })

        if (existingBranchName === "") {
            let branchName = user?.GithubName + "_" + getDate() + "_" + getRandomNumber() + "_" + "changes"
            setName(branchName)
            axiosInstance.post("/branch", {
                project_id: project?.Id,
                branch_name: branchName
            })
        } else {
            setName(existingBranchName)
        }

    }


    return (
        <></>
    )
}

export default EditingSetup