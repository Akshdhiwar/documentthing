import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useProjectStore from "@/store/projectStore"
import { ChevronRight, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

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
        axiosInstance.get(`/member/org/${project?.Id}`).then(data => {
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
        <div className='flex flex-col h-full'>
            <header>
                <h3 className="text-xl font-bold">Members</h3>
                <p className="text-muted-foreground">
                    Manage your members for this particular project according to your preference.
                </p>
            </header>
            {
                isNoOrg && <div className=" h-full flex items-center justify-center tracking-tight">
                    This project is currently not linked to any organization.
                </div>
            }
            {
                loading && <div className="h-full flex items-center justify-center">
                    <Loader className="animate-spin"></Loader>
                </div>
            }
            {
                members.length > 0 &&
                <div className="pt-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Invited</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member: Member) => (
                                <TableRow className="group">
                                    <TableCell className="font-medium"><Avatar>
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar></TableCell>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>{member.isActive}</TableCell>
                                    <TableCell><Link className="group-hover:block hidden " to={`../${member.name}`}><ChevronRight className="text-muted-foreground"></ChevronRight></Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            }

        </div>

    )
}

export default MemberTable