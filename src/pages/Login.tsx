import { supabase } from '@/shared/constant/supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSessionStorage } from '@/shared/custom hooks/useSessionStorage';
import { Button } from '../components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import axiosInstance from '@/shared/axios intercepter/axioshandler';
import useUserStore from '@/store/userStore';

const Login = () => {
    let navigate = useNavigate();
    const [session, setSession] = useState<unknown>(null);
    const { setItem } = useSessionStorage("user")
    const setUser = useUserStore(state => state.setUserData)

    function loginWithGithub() {
        const clientID = "Ov23li8wPmHr2aUiox1X"
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + clientID + "&scope=repo,user")
    }

    useEffect(() => {
        githubLogin()
    }, [])

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
            setItem(userDetials)
            setUser(userDetials)
            navigate("/dashboard");
        }
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
                        simple<span className='font-semibold'>Docs</span>
                    </p>
                    <p className="text-base text-muted-foreground mb-8">
                        One step away to create your own docs
                    </p>
                </div>
                <Button className='w-full gap-2' onClick={loginWithGithub}><GitHubLogoIcon></GitHubLogoIcon> Github</Button>

                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google", "github"]}
                    socialLayout="vertical"
                    theme="light"
                    onlyThirdPartyProviders
                />
            </div>
        </div>
    )
}

export default Login