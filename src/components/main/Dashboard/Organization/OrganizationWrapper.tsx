import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import DashboardSideNav from '../DashboardSideNav'
import useUserStore from '@/store/userStore'
import { NavLink, Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
// import Billing from './Billing'

const OrganizationWrapper = () => {

    const { user } = useUserStore(state => state)

    return (
        <main className="flex-1 flex flex-col">
            <div className='flex flex-col bg-white sticky top-0 z-10'>
                <div className="flex h-12 max-h-12 items-center justify-between py-2 p-5 border-b border-default">
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
                    <p className="text-gray-1100 block px-2 py-1 text-xs leading-5 focus:bg-gray-100 focus:text-gray-900 focus:outline-none "> {user?.GithubName}'s Organization</p>
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