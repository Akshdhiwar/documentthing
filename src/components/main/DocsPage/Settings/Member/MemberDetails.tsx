import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/shared/axios intercepter/axioshandler"
import useProjectStore from "@/store/projectStore"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const MemberDetails = () => {

    const { memberName } = useParams()
    const [isLoading, setLoading] = useState(false)
    const project = useProjectStore(state => state.project)
    const [user, setUser] = useState<UserDetails | null>(null)

    function getUserDetail() {
        setLoading(true);
        axiosInstance.get(`/member/${project?.Id}/${memberName}`).then((data) => {
            setUser(data.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        getUserDetail()
    }, [])


    return (
        <div className="h-full flex flex-col gap-2">
            <header className="flex gap-2 items-center">
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
                                <Button size={"sm"}>Invite</Button>
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