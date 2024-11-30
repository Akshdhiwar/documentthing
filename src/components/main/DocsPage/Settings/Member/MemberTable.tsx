import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useProjectStore from "@/store/projectStore"
import { ChevronRight, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import MemberInviteDialog from "./MemberInviteDialog"
import useUserStore from "@/store/userStore"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const MemberTable = () => {
    const axiosInstance = useAxiosWithToast()
    const project = useProjectStore(state => state.project)
    const { user } = useUserStore(state => state)
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
        <div className='flex flex-col flex-1 h-full'>
            <header className="flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Members</h3>
                    <MemberInviteDialog email={""} name={""} userName={user?.GithubName!} projectName={project?.Name!} projectId={project?.Id} refresh={() => { }} disabled={false} />
                </div>
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
                members.length > 0 && !loading &&
                <div className="flex-1 basis-0">
                    <ScrollArea className="min-w-full pt-8 flex-1 basis-0 flex">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[100px]"></TableHead>
                                    <TableHead className="min-w-[200px]">Name</TableHead>
                                    <TableHead className="min-w-[200px]">Account Type</TableHead>
                                    <TableHead className="min-w-[200px]">Role</TableHead>
                                    <TableHead className="min-w-[200px]">Invited</TableHead>
                                    <TableHead className="min-w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member: Member) => (
                                    <TableRow className="group" key={member.id}>
                                        <TableCell className="font-medium">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell className="capitalize">{member.type}</TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.isActive}</TableCell>
                                        <TableCell>
                                            <Link
                                                className={`${member.type !== "google" && "group-hover:block"
                                                    } hidden`}
                                                to={`../${member.name}`}
                                            >
                                                <ChevronRight className="text-muted-foreground" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

            }

        </div>

    )
}

export default MemberTable