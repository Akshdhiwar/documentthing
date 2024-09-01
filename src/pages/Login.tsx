import { supabase } from '@/shared/constant/supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '@/shared/custom hooks/useSessionStorage';
import { Button } from '../components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import axiosInstance from '@/shared/axios intercepter/axioshandler';
import useUserStore from '@/store/userStore';

const Login = () => {
    let navigate = useNavigate();
    const [session, setSession] = useState<unknown>(null);
    const { getItem , setItem } = useSessionStorage("invite")
    const setUser = useUserStore(state => state.setUserData)
    const user = useUserStore(state => state.user)

    function loginWithGithub() {
        const clientID = import.meta.env.VITE_GITHUB_CLIENT
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + clientID + "&scope=repo,user" )
    }

    useEffect(() => {
        githubLogin()
        lookInviteToken()
    }, [])

    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY2QiLCJleHAiOjE3MjUzMDM4ODUsImdpdGh1Yk5hbWUiOiJBa3NoZGhpd2FyIiwicHJvamVjdElEIjoiZjEzNTIwYTQtODI4Yy00OWVkLWI5OWMtZDFkOTZjMzEyYWFjIiwic3ViIjoiNjQxMTVhMDUtMTFlZS00MmJkLTg0MGMtMzdlYTNlMGFlNzEyIn0.vo_HDpSRpLsQy4jSd31oYXX88eI4DSFTbqgV0ZjaPQo"

    function lookInviteToken(){
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const inviteCode = urlParam.get("invite");
        if(inviteCode){
            setItem(inviteCode)
        }
    }

    function sendInviteIfExists(){
        if(user && getItem()){
            axiosInstance.post("/invite/accept" , {
                name : user?.GithubName,
                token : JSON.parse(getItem()),
                id : user.ID
            })
        }
    }
    

    async function githubLogin() {
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const code = urlParam.get("code");
        if (code) {
            const token = await axiosInstance.post("/account/get-access-token", { code: code }).then(res => {
                return res.data.access_token;
            })
            localStorage.setItem("gth-access-token", token)
        }
        if (code || localStorage.getItem("gth-access-token")) {
            const userDetials : UserInterface = await axiosInstance.get("/account/user-details").then(res => {
                return res.data.userDetails;
            })
            setUser(userDetials)
            navigate("/dashboard");
        }
        sendInviteIfExists()
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        if (session) {
            setItem(session)
            navigate("/dashboard");
        }

        return () => subscription.unsubscribe();
    }, [session]);

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className="w-[350px] py-6 box-border">
                <div className='text-center'>
                    <p className="text-2xl leading-tight tracking-tighter md:text-3xl lg:leading-[1.1] text-primary">
                        better<span className='font-semibold'>Docs</span>
                    </p>
                    <p className="text-base text-muted-foreground mb-8">
                        One step away to create your own docs
                    </p>
                </div>
                <Button className='w-full gap-2' onClick={loginWithGithub}><GitHubLogoIcon></GitHubLogoIcon> Github</Button>
            </div>
        </div>
    )
}

export default Login