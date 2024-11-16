import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import useProjectStore from "@/store/projectStore"
import { ChevronLeft, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import MemberInviteDialog from "./MemberInviteDialog"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import monthltSubs from "@/pages/Subscription/Subscription"

const MemberDetails = () => {
    const axiosInstance = useAxiosWithToast()
    const { memberName } = useParams()
    const [isLoading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const project = useProjectStore(state => state.project)
    const [user, setUser] = useState<UserDetails | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [activeUserCount, setActiveUserCount] = useState(0)
    const [maxUserCount, setMaxUserCount] = useState(0)
    const { org } = useUserStore(state => state)
    let planID = ""

    async function getUserDetail() {
        setLoading(true);
        axiosInstance.get(`/member/${project?.Id}/${memberName}`).then((data) => {
            setUser(data.data)
        }).then(() => {
            fetchMembers()
        }).then(() => {
            fetchDetails()
            setLoading(false)
        })
    }

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
            setActiveUserCount(groupedArray.length)

            // handle the groupedArray as needed

        } catch (error) {
            console.error("Error fetching members:", error);
        }
    }

    async function fetchDetails() {
        const response = await axiosInstance.get(`/orgs/${org?.id}/billing/details`)
        planID = (await response).data.subscription_details.plan_id

        monthltSubs.forEach((e) => {
            if (e.planID === planID) {
                setMaxUserCount(e.maxUser)
            }
        })
    }



    useEffect(() => {
        getUserDetail()
    }, [refresh])

    return (
        <div className="h-full flex flex-col gap-2">
            <header className="flex gap-2 items-center">
                <Link to={".."}><ChevronLeft></ChevronLeft></Link>
                {
                    !isLoading && <Avatar>
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name ? user?.name[0] : "$"}</AvatarFallback>
                    </Avatar>
                }
                <h3 className="text-l font-bold">{memberName}</h3>
            </header>
            <div className="flex-1">
                {
                    isLoading ? <div className="flex h-full items-center justify-center">
                        <Loader className="animate-spin"></Loader>
                    </div> : <div className="grid grid-cols-2 gap-6">
                        <div className="my-4">
                            <p className="tracking-tight">Name</p>
                            <p className="text-muted-foreground">{user?.name === null ? "No name provided on github" : user?.name}</p>
                        </div>
                        <div className="my-4">
                            <p className="tracking-tight">Email</p>
                            <p className="text-muted-foreground">{user?.email === null ? "No email provided on github" : user?.email}</p>
                        </div>
                        <div className="my-4">
                            <p className="tracking-tight">Role</p>
                            <p className="text-muted-foreground">{user?.role === "" ? "This user is not in this project" : user?.role}</p>
                        </div>
                        <div className="my-4">
                            <p className="tracking-tight">Project</p>
                            <p className="text-muted-foreground">{user?.isActive === null ?
                                <div className="flex gap-4 items-center">
                                    <span>This user is not invited in this project</span>
                                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                        <DialogTrigger asChild>
                                            <Button size={"sm"} disabled={activeUserCount === maxUserCount}>Invite</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <MemberInviteDialog email={user.email} name={user.githubName} projectId={project?.Id} refresh={setRefresh} disabled={activeUserCount === maxUserCount} />
                                        </DialogContent>
                                    </Dialog>
                                    {/* <Button size={"sm"} onClick={() => { inviteUser(user.email) }}>Invite</Button> */}
                                </div>
                                : user?.isActive}</p>
                        </div>
                        <div className="my-4">
                            <p className="tracking-tight">Company</p>
                            <p className="text-muted-foreground">{user?.company === "" ? "No company provided on github" : user?.company}</p>
                        </div>
                        <div className="my-4">
                            <p className="tracking-tight">Twitter</p>
                            <p className="text-muted-foreground">{user?.twitter === null ? "No twitter provided on github" : user?.twitter}</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default MemberDetails