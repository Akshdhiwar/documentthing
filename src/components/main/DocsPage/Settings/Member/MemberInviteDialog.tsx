import { Button } from "@/components/ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import { Loader } from "lucide-react"
import { Dispatch, useRef, useState } from "react"

interface MemberInviteType {
    name: string
    email: string
    projectId: string | undefined
    refresh: Dispatch<any>
    disabled : boolean
}

const RoleMap = [
    "Admin", "Editor" , "Viewer"
]

const MemberInviteDialog = ({ name, projectId, refresh , disabled, email}: MemberInviteType) => {
    const axiosInstance = useAxiosWithToast()
    const inputValue = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const {org } = useUserStore(state => state)

    function inviteUser(event: any) {
        event.preventDefault();
        if(disabled) return
        if (!inputValue.current || !inputValue.current.value) {
            toast({
                title: "Project name not present",
                description: "Please provide a project name to create one.",
                variant: "destructive"
            })
            inputValue.current?.focus()
            return;
        }

        setLoading(true)

        axiosInstance.post("/invite/create", {
            github_name: name,
            email: inputValue.current.value,
            project_id: projectId,
            role: value,
            org_id : org?.id
        }).then(data => {
            console.log(data)
            setLoading(false)
            toast({
                title: "Invite Sent",
                description: "Invite will be expired after 48 hours",
                variant: "success"
            })
            refresh((prev: boolean) => !prev)
        })
    }

    return (
        <div>
            <DialogHeader>
                <DialogTitle>Create new project</DialogTitle>
                <DialogDescription>
                    Enter the name for your new project.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={inviteUser}>
                <div className="grid gap-4 py-4">
                    <div >
                        <Input id="name" ref={inputValue} value={email} placeholder='Email' autoComplete='off' className='w-full' />
                    </div>
                    <div className='w-full'>
                        <Select onValueChange={(event) => setValue(event)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select Role</SelectLabel>
                                    {
                                        RoleMap.map(role => (
                                            <SelectItem value={role}>{role}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <DialogFooter>
                    <Button type='submit' size={"sm"} disabled={loading || disabled} >Create
                        {loading &&
                            <Loader height={18} width={18} className='ml-1 animate-spin'></Loader>
                        }
                    </Button>
                </DialogFooter>
            </form>
        </div>
    )
}

export default MemberInviteDialog