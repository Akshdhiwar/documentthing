import CustomAlert from "@/components/custom/CustomAlert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import { useEffect, useState } from "react"

const OrgMembers = () => {

    const axiosInstance = useAxiosWithToast()
    const { org } = useUserStore(state => state)
    const [members, setMembers] = useState<any[]>([])

    async function fetchMembers() {
        try {
            const response = await axiosInstance.get(`/orgs/${org?.id}/members`);
            if (response.data === null) return
            // Group data by user_name
            const grouped = response.data.reduce((acc: any, member: any) => {
                const { github_name, project_name, role } = member;

                // Initialize the user_name key if it doesn't exist
                if (!acc[github_name]) {
                    acc[github_name] = [];
                }

                // Push the project info to the array for this user_name
                acc[github_name].push({ project_name, role });
                return acc;
            }, {});

            // Convert grouped object to array
            const groupedArray = Object.entries(grouped).map(([github_name, projects]) => ({
                github_name,
                projects
            }));
            setMembers(groupedArray)
            console.log(groupedArray)

            // handle the groupedArray as needed

        } catch (error) {
            console.error("Error fetching members:", error);
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    return (
        <div>
            <CustomAlert type="info" title="" hideTitle={true} >
                To invite members, please navigate to the desired project and select the option to invite members specifically to that project.
            </CustomAlert>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members?.map((member: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{member.github_name}</TableCell>
                            <TableCell>{member.projects.map((project: any) => project.project_name).join(', ')}</TableCell>
                            <TableCell>{member.projects.map((project: any) => project.role).join(', ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table >
        </div>
    )
}

export default OrgMembers