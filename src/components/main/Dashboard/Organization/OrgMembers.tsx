import CustomAlert from "@/components/custom/CustomAlert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { TrackPageView } from "@/shared/utils/GoogleAnalytics"
import useUserStore from "@/store/userStore"
import { useEffect, useState } from "react"

const OrgMembers = () => {

    const axiosInstance = useAxiosWithToast()
    const { org, user } = useUserStore(state => state)
    const [members, setMembers] = useState<any[]>([])

    async function fetchMembers() {
        try {
            const response = await axiosInstance.get(`/orgs/${org?.id}/members`);
            if (response.data === null) return
            const grouped = response.data.reduce((acc: any, member: any) => {
                const { github_name, name, project_name, role } = member;

                // Determine the key based on availability
                const key = github_name || name || "Unknown";

                // If the key doesn't exist, initialize it with default structure
                if (!acc[key]) {
                    acc[key] = {
                        name: name || github_name || "Unknown", // Prefer name, fallback to github_name
                        role: role || null, // Set role if available
                        projects: [] // Initialize projects array
                    };
                }

                // Add project to the projects array for the key
                acc[key].projects.push({
                    project_name: project_name || "No Project",
                    role: role || null
                });

                return acc;
            }, {});

            // Convert grouped object into array if needed
            const groupedArray = Object.values(grouped);

            setMembers(groupedArray);



            // handle the groupedArray as needed

        } catch (error) {
            console.error("Error fetching members:", error);
        }
    }

    useEffect(() => {
        TrackPageView(user?.Name, user?.ID)
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
                            <TableCell>{member.name}</TableCell>
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