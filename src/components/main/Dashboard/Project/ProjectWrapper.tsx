import { Outlet } from "react-router-dom"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const ProjectWrapper = () => {

    return (
        <main className="flex-1 flex flex-col">
            <div className="flex h-[50px] max-h-[50px] items-center justify-between py-2 px-5 border-b border-default bg-white sticky top-0 z-10">
                <div className="flex gap-2 items-center">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-[24px]" />
                    <p className="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">Projects</p>
                </div>
            </div>
            <Outlet></Outlet>
        </main>
    )
}

export default ProjectWrapper