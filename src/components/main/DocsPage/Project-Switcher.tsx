import { ChevronsUpDown, Command } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useProjectStore from "@/store/projectStore"
import { Link } from "react-router-dom"

export function ProjectSwitcher({
    projectList,
}: {
    projectList: Project[]
}) {
    const { project, setProject } = useProjectStore(state => state)

    function goToSpecificProject(project: Project) {
        setProject(project)
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Command className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {project?.Name}
                                </span>
                                <span className="truncate text-xs">{project?.Role}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Projects
                        </DropdownMenuLabel>
                        {projectList.map((project) => (
                            <Link key={project.Id} to={`/project/${project.Id}/docs`} onClick={() => goToSpecificProject(project)}>
                                <DropdownMenuItem
                                    key={project.Name}
                                    className="gap-2 p-2 flex justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            <Command className="size-4 shrink-0" />
                                        </div>
                                        {project.Name}
                                    </div>

                                    <span className="text-xs text-muted-foreground">
                                        {project.Role}
                                    </span>
                                </DropdownMenuItem></Link>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}