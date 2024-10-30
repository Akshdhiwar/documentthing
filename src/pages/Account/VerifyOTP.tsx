import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

const VerifyOTP = () => {
  const axiosInstance = useAxiosWithToast()
  const location = useLocation()
  const navigate = useNavigate()
  const { email } = location.state || {};
  const {toast} = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axiosInstance.post("/account/verify-otp", {
      otp: data.pin.toString()
    }).then(()=>{
      // show the toast
      toast({
        title: "Success",
        description: "One-time password has been verified successfully",
        variant: "success",
      })

      // Navigate to dashboard after successful OTP verification
      navigate("/dashboard/projects")
    })
  }

  function onResend() {
    axiosInstance.post("/account/add-email", {
      email: email
    })
  }

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-evenly'>
      <div className="w-[350px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
          <div className="text-sm">
            <p>Didn't got code? <Button variant={"link"} onClick={onResend}>resend</Button></p>
            <p>Not your email <span className="font-medium">{email}</span> ? <Link className="underline" to={"/account/verify-email"}>back</Link></p>
          </div>

        </Form>
      </div>
      <div></div>
    </div>
  )
}

export default VerifyOTP