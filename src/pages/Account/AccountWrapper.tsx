import { Outlet } from 'react-router-dom'

const AccountWrapper = () => {
    return (
        <div className='h-dvh w-dvw flex items-center justify-center'>
            <Outlet></Outlet>
        </div>
    )
}

export default AccountWrapper