import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import useUserStore from "@/store/userStore"
import { ArrowUpRight, LogOut, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const DashboardSideNav = () => {
    const navigate = useNavigate()
    const axiosInstance = useAxiosWithToast()
    const { setOrg } = useUserStore(state => state)
    const [orgName, setOrgName] = useState<string>("")
    const { user } = useUserStore(state => state)

    function getOrg() {
        axiosInstance.get("/account/org").then((data: any) => {
            setOrg(data.data.org)
            setOrgName(data.data.org.name)
        })
    }

    useEffect(() => {
        getOrg()
    }, [])

    function logout() {
        localStorage.clear()
        navigate("/account/login")
    }

    return (
        <aside className="h-full">
            <div className="w-64 border-r border-default h-full overflow-auto">
                <div className="h-12 max-h-12 flex items-center border-b border-default px-6">
                    <h4 className="truncate mb-0 text-lg">Dashboard</h4>
                </div>
                <nav>
                    <ul>
                        <div className="border-b py-5 px-6 border-default">
                            <div className="flex space-x-3 mb-2 font-normal">
                                <span className="text-sm text-secondary-foreground w-full">
                                    Projects
                                </span>
                            </div>
                            <ul className="space-y-1">
                                <Link to="projects">
                                    <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                        <span title="Projects" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground"> All Projects</span>
                                    </span>
                                </Link>
                            </ul>
                        </div>
                        <div className="border-b py-5 px-6 border-default">
                            <div className="flex space-x-3 mb-2 font-normal">
                                <span className="text-sm text-secondary-foreground w-full">
                                    Organizations
                                </span>
                            </div>
                            <ul className="space-y-1">
                                <a href="#">
                                    <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                        <span title="Akash" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground">{orgName}'s Org</span>
                                    </span>
                                </a>
                            </ul>
                        </div>
                        <div className="border-b py-5 px-6 border-default">
                            <div className="flex space-x-3 mb-2 font-normal">
                                <span className="text-sm text-secondary-foreground w-full">
                                    Account
                                </span>
                            </div>
                            <ul className="space-y-1">
                                <a href="#">
                                    <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                        <span title="Akash" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground">Preferences</span>
                                    </span>
                                </a>
                            </ul>
                        </div>
                        <div className="border-b py-5 px-6 border-default">
                            <div className="flex space-x-3 mb-2 font-normal">
                                <span className="text-sm text-secondary-foreground w-full">
                                    Documentation
                                </span>
                            </div>
                            <ul className="space-y-1">
                                <a href="#">
                                    <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                        <ArrowUpRight className="text-secondary-foreground text-slate-600" height={18} width={18} />
                                        <span title="Akash" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground">AECInspire Org</span>
                                    </span>
                                </a>
                                <a href="#">
                                    <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                        <ArrowUpRight className="text-secondary-foreground text-slate-600" height={18} width={18} />
                                        <span title="Akash" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground">AECInspire Org</span>
                                    </span>
                                </a>
                            </ul>
                        </div>
                        {
                            user?.GithubID == import.meta.env.VITE_ADMIN_GITHUB_ID &&
                            <div className="border-b py-5 px-6 border-default">
                                <ul className="space-y-1">
                                    <Link to="admin">
                                        <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                            <ShieldCheck className="text-secondary-foreground text-slate-600" height={18} width={18} />
                                            <span title="Super Admin" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground">Super Admin</span>
                                        </span>
                                    </Link>
                                </ul>
                            </div>
                        }
                        <div className="border-b py-5 px-6 border-default">
                            <ul className="space-y-1">
                                <Link to="/account" onClick={() => (logout())}>
                                    <span className="group flex max-w-full cursor-pointer items-center py-1 gap-1">
                                        <LogOut className="text-secondary-foreground text-slate-600" height={18} width={18} />
                                        <span title="Akash" className="w-full truncate text-sm transition-all font-medium text-slate-600 group-hover:text-foreground">Logout</span>
                                    </span>
                                </Link>
                            </ul>
                        </div>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}

export default DashboardSideNav