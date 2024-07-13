import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { Dispatch, useRef, useState } from 'react'

type Props = {
    close: Dispatch<any>
    refresh: Dispatch<any>
}

const ProjectCreationDailog = ({ close , refresh }: Props) => {

    const inputValue = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

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

        const response = await axios.post("http://localhost:3000/api/v1/project/create" , {name : inputValue.current.value})
        if(response.status !== 201) {
            toast({
                title: "Error",
                description: response.data.message,
                variant: "destructive"
            })
        }else{
            toast({
                title: "Success",
                description: response.data.message,
                variant: "success"
            })
        }

        refresh((prev : boolean) => !prev)
        close(false)
    }

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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" ref={inputValue} autoComplete='off' className="col-span-3" />
                    </div>
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