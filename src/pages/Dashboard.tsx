import { useSessionStorage } from "@/shared/custom hooks/useSessionStorage"
import useUserStore from "@/store/userStore"
import { useEffect } from "react"
import DashboardSideNav from "@/components/main/Dashboard/DashboardSideNav"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"

const Dashboard = () => {
    const axiosInstance = useAxiosWithToast()
    const { getItem } = useSessionStorage("invite")
    const user = useUserStore(state => state.user)

    function sendInviteIfExists() {
        if (user && getItem()) {
            axiosInstance.post("/invite/accept", {
                name: user?.GithubName,
                token: JSON.parse(getItem()),
                id: user.ID
            }).then(data => {
                if (data.status === 200) {
                    sessionStorage.removeItem("invite")
                }
            })
        }
    }

    useEffect(() => {
        sendInviteIfExists()
    }, [])

    return (
        <SidebarProvider>
            <div className="h-full w-full">
                <div className='h-full flex'>
                    <div className='hidden md:flex'>
                        <DashboardSideNav />
                    </div>
                    <div className='flex-1 basis-0'>
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default Dashboard