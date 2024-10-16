import { useSessionStorage } from "@/shared/custom hooks/useSessionStorage"
import ProjectDasboard from "../components/main/Dashboard/ProjectDasboard"
import useUserStore from "@/store/userStore"
import { useEffect } from "react"
import DashboardSideNav from "@/components/main/Dashboard/DashboardSideNav"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"

const Dashboard = () => {
    const axiosInstance = useAxiosWithToast()
    const { getItem } = useSessionStorage("invite")
    const user = useUserStore(state => state.user)

    function sendInviteIfExists(){
        if(user && getItem()){
            axiosInstance.post("/invite/accept" , {
                name : user?.GithubName,
                token : JSON.parse(getItem()),
                id : user.ID
            }).then(data => {
                if (data.status === 200) {
                    sessionStorage.removeItem("invite")
                }
            })
        }
    }

    useEffect(()=>{
        sendInviteIfExists()
    },[])

    return (
        <div className="h-full">
            <div className='h-full flex'>
            <div className='hidden md:flex'>
                <DashboardSideNav />
            </div>
            <main className="flex-1 flex flex-col">
                <div className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-b border-default">
                    <div className='md:hidden'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size={"icon"} className="p-1" variant={"ghost"}><Menu height={18} width={18}></Menu></Button>
                            </SheetTrigger>
                            <SheetContent className="p-0 w-min" side={"left"}>
                                <DashboardSideNav />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <p className="text-gray-1100 block px-2 py-1 text-xs leading-5 focus:bg-gray-100 focus:text-gray-900 focus:outline-none ">Projects</p>
                </div>
                <div className='flex-1 basis-0 overflow-auto'>
                    <ProjectDasboard />
                </div>
            </main>
        </div>
        </div>
    )
}

export default Dashboard