import Sidenav from "@/components/main/DocsPage/Settings/Sidenav"
import { Separator } from "@/components/ui/separator"
import { Outlet } from "react-router-dom"


const ProjectSettings = () => {
    return (
        <>
            <div className="hidden space-y-6 h-full p-10 pb-16 md:flex flex-col">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col flex-1 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="lg:w-1/5">
                        <Sidenav />
                    </aside>
                    <div className="flex-1 basis-0 overflow-y-auto">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectSettings