
import { Outlet } from 'react-router-dom'
import DashboardSideNav from './Dashboard/DashboardSideNav'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'

const ProjectDasboard = () => {
    return (
        <div className='h-full flex'>
            <div className='hidden md:flex'>
                <DashboardSideNav />
            </div>
            <main className="flex-1">
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
                <Outlet></Outlet>
            </main>
        </div>
    )
}

export default ProjectDasboard