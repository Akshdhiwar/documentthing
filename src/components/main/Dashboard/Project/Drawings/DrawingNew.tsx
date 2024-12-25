import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from "@/components/ui/responsive-dialog"
import { Plus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const formSchema = z.object({
    name: z.string()
});

const DrawingNew = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values)
            setOpenDialog(false)
        } catch (error) {
            console.error("Form submission error", error);
            setOpenDialog(false)
        }
    }

    return (
        <ResponsiveModal open={openDialog} onOpenChange={setOpenDialog}>
            <ResponsiveModalTrigger asChild>
                <Card className="h-full transition-all hover:border-primary hover:shadow-md hover:cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div className="mb-4 p-3 rounded-full bg-primary/10">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
                        <p className="text-sm text-muted-foreground">
                            Create a new project to start building
                        </p>
                    </CardContent>
                </Card>
            </ResponsiveModalTrigger>
            <ResponsiveModalContent side={"bottom"}>
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle>Invite Team-mate</ResponsiveModalTitle>
                    <ResponsiveModalDescription>
                        Add their gmail address to get the invite link
                    </ResponsiveModalDescription>
                </ResponsiveModalHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Drawing Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Frontend Architecture"

                                            type="text"
                                            {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </ResponsiveModalContent>
        </ResponsiveModal>
    )
}

export default DrawingNew