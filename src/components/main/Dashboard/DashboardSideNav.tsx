import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import useUserStore from "@/store/userStore"
import { DashboardIcon } from "@radix-ui/react-icons"
import { ArrowUpRight, LogOut, ShieldCheck, Target, UsersRound } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

const DashboardSideNav = () => {
    const navigate = useNavigate()
    const { user, org } = useUserStore(state => state)

    function logout() {
        localStorage.clear()
        navigate("/account/login")
    }

    return (

        <Sidebar>
            <SidebarHeader className="border-b">
                <p className="text-2xl font-extralight leading-tight tracking-tighter md:text-3xl lg:leading-[1.1] text-primary">
                    <span className='font-semibold'>document</span>Thing
                </p>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                <SidebarGroup className="border-b">
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/dashboard/projects">
                                        <DashboardIcon />
                                        <span>All Projects</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="border-b">
                    <SidebarGroupLabel>Organizations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/dashboard/organization">
                                        <UsersRound />
                                        <span>{org?.name}'s Org</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="border-b">
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/dashboard/projects">
                                        <Target />
                                        <span>Appearance</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="border-b">
                    <SidebarGroupLabel>Published documentation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/dashboard/projects">
                                        <ArrowUpRight />
                                        <span>Akash's Documentation</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/dashboard/projects">
                                        <ArrowUpRight />
                                        <span>John's Documentation</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {user?.GithubID == import.meta.env.VITE_ADMIN_GITHUB_ID &&
                    <SidebarGroup className="border-b">
                        <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <NavLink to="/dashboard/projects">
                                            <ShieldCheck />
                                            <span>Super Admin Account</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                }
            </SidebarContent>
            <SidebarFooter className="border-b">
                <SidebarMenuButton asChild>
                    <NavLink to="/account" onClick={logout}>
                        <LogOut />
                        <span>Logout</span>
                    </NavLink>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSideNav