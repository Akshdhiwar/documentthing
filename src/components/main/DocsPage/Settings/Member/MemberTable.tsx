import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useProjectStore from "@/store/projectStore"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

const MemberTable = () => {

    const project = useProjectStore(state => state.project)
    const [members, setMembers] = useState<Member[]>([])
    const [isNoOrg, setIsNoOrg] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getGithubMembers()
    }, [])

    function getGithubMembers() {
        setLoading(true)
        axiosInstance.get(`/member/${project?.Id}`).then(data => {
            setMembers(data.data)
            setLoading(false)
        }).catch(error => {
            if (error.response.status === 404) {
                setIsNoOrg(true)
                setLoading(false)
            }
        })
    }

    return (
        <>
            {
                isNoOrg && <div className="text-center tracking-tight">
                    This project is currently not linked to any organization.
                </div>
            }
            {
                loading && <div>
                    <Loader className="animate-spin"></Loader>
                </div>
            }
            {
                members.length > 0 &&
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Invited</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member : Member) => (
                            <TableRow>
                                <TableCell className="font-medium"><Avatar>
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar></TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>{member.isActive}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }

        </>

    )
}

export default MemberTable