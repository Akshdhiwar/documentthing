import { supabase } from '@/constant/supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSessionStorage } from '@/custom hooks/useSessionStorage';

const Login = () => {
    let navigate = useNavigate();
    const [session, setSession] = useState<unknown>(null);
    const {setItem} = useSessionStorage("user")

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

                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google", "github"]}
                    socialLayout="vertical"
                    theme="light"
                // onlyThirdPartyProviders
                />
            </div>
        </div>
    )
}

export default Login