import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '@/shared/custom hooks/useSessionStorage';
import { Button } from '../../components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import useUserStore from '@/store/userStore';
import { Icons } from '../../shared/components/Icons'
import useAxiosWithToast from '@/shared/axios intercepter/axioshandler';
import { useGoogleLogin } from "@react-oauth/google"

const Login = () => {
    const axiosInstance = useAxiosWithToast()
    let navigate = useNavigate();
    const { getItem, setItem } = useSessionStorage("invite")
    const { setUserData, setOrg, user } = useUserStore(state => state)
    const [loding, setLoading] = useState<boolean>(false)
    let type: "github" | "google"

    function loginWithGithub() {
        setLoading(true)
        type = "github"
        const clientID = import.meta.env.VITE_GITHUB_APP_CLIENT
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + clientID)
    }

    function loginWithGoogle() {
        setLoading(true)
        googleLogin()
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (code) => {
            const userDetials = await axiosInstance.post("/account/get-access-token", { code: code.code, type: "google" }).then(res => {
                return res.data.userDetails;
            }).catch(() => {
                setLoading(false)
                return
            })
            setUserData(userDetials)
            localStorage.setItem("betterDocs", "true")
            await axiosInstance.get("/account/org").then((data: any) => {
                setOrg(data.data.org)
            })
            if (userDetials && getItem()) {
                await axiosInstance.post("/invite/accept", {
                    name: userDetials?.Type === "google" ? userDetials.Name : userDetials?.GithubName,
                    token: JSON.parse(getItem()),
                    id: userDetials.ID,
                    type: userDetials?.Type
                }).then(data => {
                    if (data.status === 200) {
                        sessionStorage.removeItem("invite")
                    }
                })
            }

            if (userDetials.Email === "") {
                navigate("/account/verify-email")
                return;
            }

            // const status: any = await axiosInstance.get("/account/status").then(res => {
            //     return res.data;
            // })

            // if (status.id == null) {
            //     navigate("/account/subscription")
            //     return;
            // }
            setLoading(false)
            navigate("/dashboard/projects");
            return
        },
        flow: 'auth-code',
    })

    useEffect(() => {
        lookInviteToken()
        CheckLogin()
    }, [])

    function lookInviteToken() {
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const inviteCode = urlParam.get("invite");
        if (inviteCode) {
            setItem(inviteCode)
        }
    }

    async function CheckLogin() {
        setLoading(true)
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        const code = urlParam.get("code");
        if (code) {
            const userDetials = await axiosInstance.post("/account/get-access-token", { code: code, type: type }).then(res => {
                return res.data.userDetails;
            }).catch(() => {
                setLoading(false)
            })
            setUserData(userDetials)
            localStorage.setItem("betterDocs", "true")
            await axiosInstance.get("/account/org").then((data: any) => {
                setOrg(data.data.org)
            })
            if (userDetials && getItem()) {
                await axiosInstance.post("/invite/accept", {
                    name: userDetials?.Type === "google" ? userDetials.Name : userDetials?.GithubName,
                    token: JSON.parse(getItem()),
                    id: userDetials.ID,
                    type: userDetials?.Type
                }).then(data => {
                    if (data.status === 200) {
                        sessionStorage.removeItem("invite")
                    }
                })
            }

            if (userDetials.Email === "") {
                navigate("/account/verify-email")
                return;
            }

            // const status: any = await axiosInstance.get("/account/status").then(res => {
            //     return res.data;
            // })

            // if (status.id == null) {
            //     navigate("/account/subscription")
            //     return;
            // }
            setLoading(false)
            navigate("/dashboard/projects");
            return
        }
        if (localStorage.getItem("betterDocs")) {
            const userDetials: UserInterface = await axiosInstance.get(`/account/user-details?type=${user?.Type}`).then(res => {
                return res.data.userDetails;
            }).catch(() => {
                setLoading(false)
            })
            setUserData(userDetials)
            await axiosInstance.get("/account/org").then((data: any) => {
                setOrg(data.data.org)
            })
            if (userDetials.Email === "") {
                navigate("/account/verify-email")
                return;
            }

            if (userDetials && getItem()) {
                await axiosInstance.post("/invite/accept", {
                    name: userDetials?.Type === "google" ? userDetials.Name : userDetials?.GithubName,
                    token: JSON.parse(getItem()),
                    id: userDetials.ID,
                    type: userDetials?.Type
                }).then(data => {
                    if (data.status === 200) {
                        sessionStorage.removeItem("invite")
                    }
                })
            }

            // const status: any = await axiosInstance.get("/account/status").then(res => {
            //     return res.data;
            // })

            // if (status.id == null) {
            //     navigate("/account/subscription")
            //     return;
            // }
            setLoading(false)
            navigate("/dashboard/projects");
        }
        setLoading(false)
    }

    return (

        <div className="w-[350px] py-6 box-border space-y-2">
            <div className='text-center'>
                <p className="text-2xl leading-tight font-extralight tracking-tighter md:text-3xl lg:leading-[1.1] text-primary">
                    <span className='font-semibold'>document</span>Thing
                </p>
                <p className="text-base text-muted-foreground mb-8">
                    One step away to create your own docs
                </p>
            </div>
            <div className='relative space-y-2'>
                <Button className='w-full gap-2' onClick={loginWithGithub} disabled={loding}><GitHubLogoIcon></GitHubLogoIcon> Github</Button>
                <Button className='w-full gap-2' onClick={() => {
                    axiosInstance.get("/ping")
                }} disabled={loding}><GitHubLogoIcon></GitHubLogoIcon> Ping</Button>
                <Button className='w-full gap-2' onClick={() => loginWithGoogle()} disabled={loding}><Icons.google className='h-[16px]'></Icons.google> Google</Button>
                <img src="/Developer.svg" alt="For dev" className='absolute top-[-170%] left-[-95%]' />
                <img src="/Manager.svg" alt="For dev" className='absolute top-[86%] left-[85%]' />
            </div>
        </div>
    )
}

export default Login
