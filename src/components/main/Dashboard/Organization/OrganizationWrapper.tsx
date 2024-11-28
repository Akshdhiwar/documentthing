import useUserStore from '@/store/userStore'
import { NavLink, Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
// import Billing from './Billing'

const OrganizationWrapper = () => {

    const { user } = useUserStore(state => state)

    return (
        <main className="flex-1 flex flex-col">
            <div className='flex flex-col bg-white sticky top-0 z-10'>
                <div className="flex h-[50px] max-h-[50px] items-center justify-between py-2 p-5 border-b border-default">
                    <div className="flex gap-2 items-center">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-[24px]" />
                        <p className="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"> {user?.Type === "google" ? user?.Name : user?.GithubName}'s Organization</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 px-5 p-2" >
                    <div className='flex gap-2'>
                        <NavLink to={"members"} className={({ isActive }) => `inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" h-8 rounded-md px-3 hover:bg-accent hover:text-accent-foreground ${isActive && "bg-accent text-accent-foreground"}
                    `}>Members
                        </NavLink>
                        <NavLink to={"billing"} className={({ isActive }) => `inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" h-8 rounded-md px-3 hover:bg-accent hover:text-accent-foreground ${isActive && "bg-accent text-accent-foreground"}
                    `}>Billing
                        </NavLink>
                    </div>
                    <Separator />
                </div>
            </div>
            <div className='flex-1 p-5'>
                <Outlet></Outlet>
            </div>
        </main>
    )
}

export default OrganizationWrapper