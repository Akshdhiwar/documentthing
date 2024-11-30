import { Outlet, useLocation } from 'react-router-dom'

const AccountWrapper = () => {

    const location = useLocation()

    return (
        <div className='h-dvh w-dvw flex items-center justify-center relative'>
            <Outlet></Outlet>
            {
                location.pathname === '/account/login' &&
                <p className="text-sm text-muted-foreground absolute bottom-4 text-center">By clicking on sign in, you agree to our Terms of Service and Privacy Policy</p>
            }
        </div>
    )
}

export default AccountWrapper