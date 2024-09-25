import axiosInstance from '@/shared/axios intercepter/axioshandler'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader, LoaderIcon, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import useUserStore from '@/store/userStore'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface InstallationType {
    name: string
    installation_id: number
    type: string
}

const ProjectCreationDailog = () => {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const user = useUserStore(state => state.user)
    const [value, setValue] = useState<string>("")
    const [selectedRepo, setSelectedRepo] = useState<string>("")
    const [accounts, setAccounts] = useState<InstallationType[] | null>(null)
    const [repos, setRepos] = useState<any>(null)
    const navigate = useNavigate()


    const createNewProject = async (event: any) => {
        event.preventDefault();
        if (value === "") {
            toast({
                title: "Project name not present",
                description: "Please provide a project name to create one.",
                variant: "destructive"
            })
            return;
        }

        setLoading(true)

        let org = ""
        let name = ""
        accounts?.map(account => {
            if(account.installation_id.toString() === value && account.type === "Organization"){
                org = account.name
            }

            if(account.installation_id.toString() === value){
                name = account.name
            }
        })

        // const response = await axiosInstance.post("/project/create", { name: inputValue.current.value })
        const response = await axiosInstance.post("/project/create-project", { name: selectedRepo, id: user?.ID, org: org , owner : name })
        if (response.status !== 201) {
            toast({
                title: "Error",
                description: response.data.message,
                variant: "destructive"
            })
            setLoading(false)
        } else {
            toast({
                title: "Success",
                description: response.data.message,
                variant: "success"
            })
            setLoading(false)
            navigate(-1)
        }
    }

    function getInstallations() {
        axiosInstance.get("/project/installation").then(res => {
            setAccounts(res.data)
        })
    }

    async function getInstallationTokenAndRepository() {
        if (value) {
            let token
            setLoading(true)
            await axiosInstance.post(`/project/installation/access_token/${value}`).then(result => {
                token = result.data
            }).catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to get installation token and repository",
                    variant: "destructive"
                })
                setLoading(false)
                return
            })

            // api to get the repo with the installation id of github app from githubapis and send the token in headers
            await axios.get(`https://api.github.com/installation/repositories`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then(result => {
                setRepos(result.data.repositories)
            }).catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to get repository",
                    variant: "destructive"
                })
                setLoading(false)
                return
            })
            setLoading(false)

        }
    }


    useEffect(() => {
        getInstallations()
    }, [])

    useEffect(() => {
        getInstallationTokenAndRepository()
    }, [value])

    return (

        <div className='w-full max-w-4xl m-auto px-8'>
            <div className='my-10'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Create new project</p>
            </div>
            <form onSubmit={createNewProject}>
                <div className="grid gap-8 py-4">
                    <div className='grid grid-cols-5 gap-4 '>
                        <div className='col-span-3'>
                            <p className='font-semibold leading-none tracking-tight'>Select Account</p>
                            <span className='text-muted-foreground text-sm tracking-wide'>Choose the Github Installation, user or organization &nbsp;</span>
                            <a className='text-sm underline text-secondary-foreground tracking-wide' href={`https://github.com/apps/${import.meta.env.VITE_ENVIRONMENT === "Local" ? "betterdocs-com" : "betterdocs-prod"}/installations/new`}>Install the Github App</a>
                        </div>
                        <div className='flex gap-1 col-span-2'>
                            <Select onValueChange={(event) => setValue(event)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose Account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Accounts</SelectLabel>
                                        {
                                            accounts?.map((account: InstallationType, index: number) => (
                                                <SelectItem key={index} value={account.installation_id.toString()}>{account.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button type='button' variant={"ghost"} size={"sm"} className='p-2 text-muted-foreground' onClick={() => getInstallations()}><RefreshCw height={18} width={18}></RefreshCw></Button>
                        </div>
                    </div>
                    {
                        value !== "" && !loading &&
                        <div className='grid grid-cols-5 gap-4'>
                            <div className='col-span-3'>
                                <p className='font-semibold leading-none tracking-tight'>Select Repository</p>
                                <span className='text-muted-foreground text-sm tracking-wide'>Choose the GitHub repository to sync with. This repository should be authorized in the &nbsp;</span>
                                <a className='text-sm underline text-secondary-foreground tracking-wide' href={`https://github.com/settings/installations/${value}`}>GitHub installation.</a>
                            </div>
                            <div className='flex gap-1 col-span-2'>
                                <Select onValueChange={(event) => setSelectedRepo(event)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose Repo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Repositories</SelectLabel>
                                            {
                                                repos?.map((repo : any, index: number) => (
                                                    <SelectItem key={index} value={repo.name}>{repo.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    }
                    {
                        loading &&
                        <div className='flex items-center justify-center py-4'>
                            <LoaderIcon className='animate-spin' />
                        </div>
                    }
                </div>
                <div className='flex items-center justify-between'>
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)} type="button">
                        Back
                    </Button>
                    <Button type='submit' size={"sm"} disabled={loading} >Create
                        {loading &&
                            <Loader height={18} width={18} className='ml-1 animate-spin'></Loader>
                        }
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ProjectCreationDailog
