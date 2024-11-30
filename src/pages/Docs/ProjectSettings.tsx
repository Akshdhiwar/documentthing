import Sidenav from "@/components/main/DocsPage/Settings/Sidenav"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft } from "lucide-react"
import { Link, Outlet } from "react-router-dom"


const ProjectSettings = () => {
    return (
        <div className="space-y-6 h-dvh w-dvw p-6 lg:p-10 lg:pb-16 flex flex-col">
            <div className="flex items-center gap-8">
                <Link to={".."}><ChevronLeft></ChevronLeft>
                </Link>
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground hidden md:block">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col flex-1 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <Sidenav />
                </aside>
                <div className="flex-1 basis-0">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    )
}

export default ProjectSettings