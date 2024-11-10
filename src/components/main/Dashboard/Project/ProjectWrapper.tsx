import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Plus } from "lucide-react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import DashboardSideNav from "../DashboardSideNav"

const ProjectWrapper = () => {

    const location = useLocation()
    console.log(location)

    return (
        <main className="flex-1 flex flex-col">
            <div className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-b border-default bg-white sticky top-0 z-10">
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
                {
                    location.pathname !== "/dashboard/projects/new" && <div className="flex items-center gap-2">
                        {/* <Button variant={"outline"} className=" h-[32px]">New Organization</Button> */}
                        <Button className=" h-[32px]"><NavLink to={"new"} className={"flex items-center justify-center gap-1 "}><Plus height={18} width={18}></Plus> <p>New Project</p></NavLink></Button>
                    </div>
                }
            </div>
            <Outlet></Outlet>
        </main>
    )
}

export default ProjectWrapper