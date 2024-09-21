import { useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '@/shared/custom hooks/useSessionStorage';
import { Button } from '../components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import axiosInstance from '@/shared/axios intercepter/axioshandler';
import useUserStore from '@/store/userStore';
import {Icons} from '../shared/Icons'

const Login = () => {
    let navigate = useNavigate();
    const { setItem } = useSessionStorage("invite")
    const setUser = useUserStore(state => state.setUserData)

    function loginWithGithub() {
        const clientID = import.meta.env.VITE_ENVIRONMENT === "Local" ? import.meta.env.VITE_GITHUB_APP_CLIENT : import.meta.env.VITE_GITHUB_CLIENT_PROD
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + clientID  )
    }

    function loginWithGoogle() {
        axiosInstance.get("/account/auth/google").then(data => {
            window.location.href = data.data
        })
    }

    useEffect(() => {
        githubLogin()
        lookInviteToken()
    }, [])

    function lookInviteToken(){
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const inviteCode = urlParam.get("invite");
        if(inviteCode){
            setItem(inviteCode)
        }
    }
    
    async function githubLogin() {
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const code = urlParam.get("code");
        if (code) {
            const userDetials = await axiosInstance.post("/account/get-access-token", { code: code }).then(res => {
                return res.data.userDetails;
            })
            setUser(userDetials)
            localStorage.setItem("betterDocs" , "true")
            navigate("/dashboard");
            return
        }
        if (localStorage.getItem("betterDocs")) {
            const userDetials : UserInterface = await axiosInstance.get("/account/user-details").then(res => {
                return res.data.userDetails;
            })
            setUser(userDetials)
            navigate("/dashboard");
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className="w-[350px] py-6 box-border space-y-2">
                <div className='text-center'>
                    <p className="text-2xl leading-tight tracking-tighter md:text-3xl lg:leading-[1.1] text-primary">
                        better<span className='font-semibold'>Docs</span>
                    </p>
                    <p className="text-base text-muted-foreground mb-8">
                        One step away to create your own docs
                    </p>
                </div>
                <Button className='w-full gap-2' onClick={loginWithGithub}><GitHubLogoIcon></GitHubLogoIcon> Github</Button>
                <Button className='w-full gap-2' onClick={loginWithGoogle}><Icons.google className='h-[16px]'></Icons.google> Google</Button>
            </div>
        </div>
    )
}

export default Login