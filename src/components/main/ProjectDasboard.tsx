
import { Outlet } from 'react-router-dom'
import DashboardSideNav from './Dashboard/DashboardSideNav'

const ProjectDasboard = () => {
    return (
        <div className='h-full flex'>
            <DashboardSideNav />
            <main className="flex-1">
                <div className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-b border-default">
                    <p className="text-gray-1100 block px-2 py-1 text-xs leading-5 focus:bg-gray-100 focus:text-gray-900 focus:outline-none ">Projects</p>
                </div>
                <Outlet></Outlet>
            </main>
        </div>
    )
}

export default ProjectDasboard