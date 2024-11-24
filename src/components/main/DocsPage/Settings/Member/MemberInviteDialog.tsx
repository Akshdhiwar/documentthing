import { Button } from "@/components/ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import { Dispatch, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import CustomAlert from "@/components/custom/CustomAlert"

interface MemberInviteType {
    name: string
    email: string
    projectId: string | undefined
    refresh: Dispatch<any>
    disabled: boolean
}

const RoleMap = [
    "Admin", "Editor", "Viewer"
]

const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    role: z.string()
});


const MemberInviteDialog = ({ name, projectId, refresh, disabled, email }: MemberInviteType) => {
    const axiosInstance = useAxiosWithToast()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { org } = useUserStore(state => state)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name,
            email: email,
            role: "Viewer"
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            axiosInstance.post("/invite/create", {
                github_name: values.name,
                email: values.email,
                project_id: projectId,
                role: values.role,
                org_id: org?.id
            }).then(() => {
                setLoading(false)
                toast({
                    title: "Invite Sent",
                    description: "Invite will be expired after 48 hours",
                    variant: "success"
                })
                refresh((prev: boolean) => !prev)
            })
        } catch (error) {
            console.error("Form submission error", error);
        }
    }


    return (
        <div>
            <DialogHeader>
                <DialogTitle>Invite Team-mate</DialogTitle>
                <DialogDescription>
                    Add their gmail address to get the invite link
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-auto pt-5">
                    <CustomAlert type="warning" title='' hideTitle={true}>
                        Access to editing documentation is exclusive to GitHub members; invite specific members to join your project for collaboration.
                    </CustomAlert>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Jhon jones"
                                        disabled={name !== ""}
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Name of the user that will be invited </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="jhonjones@gmail.com"
                                        type="email"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Email of the user that you want to invite (Link will be send)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Editor" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            RoleMap.map(role => (
                                                <SelectItem disabled={(name === "" && role !== "Viewer")} key={role} value={role}>{role}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormDescription>Role that will be applied to user for this project</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type='submit' size={"sm"} disabled={loading || disabled} >Create
                            {loading &&
                                <Loader height={18} width={18} className='ml-1 animate-spin'></Loader>
                            }
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default MemberInviteDialog