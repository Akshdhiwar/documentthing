import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import useUserStore from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Invalid email format"), // Custom error message
});

const AddEmail = () => {
    const axiosInstance = useAxiosWithToast()
    const navigate = useNavigate()
    const { user } = useUserStore(state => state)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            axiosInstance.post("/account/add-email", {
                email: values.email,
                name: user?.GithubName
            }).then(() => {
                navigate("/account/email-otp", {
                    state: { "email": values.email }
                })
            })
            // Simulate an API call
        } catch (error) {
            console.error("Form submission error", error);
        }
    };

    return (
        <div className='h-dvh w-dvw  flex flex-col items-center justify-evenly'>
            <div className="w-[350px] py-6 box-border space-y-2">
                <div className='text-center'>
                    <p className="text-2xl mb-2 leading-tight tracking-tighter md:text-3xl lg:leading-[1.1] text-primary">
                        Verify Your Email Address
                    </p>
                    <p className="text-base text-muted-foreground mb-8">
                        Please add and verify your email address to access all features and stay updated!
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Your email"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </div>
            <div></div>
        </div>
    );
};

export default AddEmail;
