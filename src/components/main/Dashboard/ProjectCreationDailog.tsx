import axiosInstance from '@/shared/axios intercepter/axioshandler'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {  Loader } from 'lucide-react'
import { Dispatch, useEffect, useRef, useState } from 'react'
import useUserStore from '@/store/userStore'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
    close: Dispatch<any>
    refresh: Dispatch<any>
}

const ProjectCreationDailog = ({ close, refresh }: Props) => {

    const inputValue = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const user = useUserStore(state => state.user)
    const [isChecked, setIsChecked] = useState(false)
    const [value, setValue] = useState("")
    const [orgs, setOrgs] = useState<any[]>([])

    useEffect(() => {
        axiosInstance.get("/orgs").then(data => {
            setOrgs(data.data)
        })
    }, [])

    const createNewProject = async (event: any) => {
        event.preventDefault();
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

        // const response = await axiosInstance.post("/project/create", { name: inputValue.current.value })
        const response = await axiosInstance.post("/project/create-project", { name: inputValue.current.value, id: user?.ID , org : value })
        if (response.status !== 201) {
            toast({
                title: "Error",
                description: response.data.message,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Success",
                description: response.data.message,
                variant: "success"
            })
        }

        refresh((prev: boolean) => !prev)
        close(false)
    }

    useEffect(()=>{
        if(isChecked === false){
            setValue("")
        }
    } ,[isChecked])

    return (

        <div>
            <DialogHeader>
                <DialogTitle>Create new project</DialogTitle>
                <DialogDescription>
                    Enter the name for your new project.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={createNewProject}>
                <div className="grid gap-4 py-4">
                    <div >
                        <Input id="name" ref={inputValue} placeholder='Project Name' autoComplete='off' className='w-full' />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={isChecked} onClick={() => setIsChecked(prev => !prev)} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Create project in company organization
                        </label>
                    </div>
                    {
                        isChecked && <div className='w-full'>
                            <Select onValueChange={(event) => setValue(event)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select Organization</SelectLabel>
                                        {
                                            orgs.map(org => (
                                                <SelectItem value={org.login}>{org.login}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    }

                </div>
                <DialogFooter>
                    <Button type='submit' size={"sm"} >Create
                        {loading &&
                            <Loader height={18} width={18} className='ml-1 animate-spin'></Loader>
                        }
                    </Button>
                </DialogFooter>
            </form>
        </div>
    )
}

export default ProjectCreationDailog