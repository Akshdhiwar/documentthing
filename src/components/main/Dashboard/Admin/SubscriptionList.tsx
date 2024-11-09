import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import formatTimestamp from "@/shared/components/DateFormatter"
import { Edit, Loader, Trash2 } from "lucide-react"
import { Dispatch, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface Subscription {
    openNewSub: Dispatch<any>
}

const formSchema = z.object({
    price: z.coerce.number().min(1)
});

const SubscriptionList: React.FC<Subscription> = ({ openNewSub }) => {

    const [subs, setSubs] = useState<any>(undefined)
    const [loading, setLoading] = useState(true)
    const [editSub, setEditSub] = useState<any>(null)
    const axiosInstance = useAxiosWithToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: 5,
        },
    });

    const { reset } = form;

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            axiosInstance.post(`/subscription/plan/update`, {
                plan_id: editSub,
                new_price: values.price
            }).then(() => {
                setEditSub(null)
            }).catch(err => {
                console.error("Error updating subscription plan:", err);
            })

        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    async function getSubDetails() {
        if (!editSub) return
        setLoading(true)
        const res = await axiosInstance.get(`/subscription/plan/details/${editSub}`)
        reset({ price: res.data.billing_cycles[0].pricing_scheme.fixed_price.value }); // Set fetched value as default
        setLoading(false)
    }

    useEffect(() => {
        getSubDetails()
    }, [editSub])


    async function getSub() {
        setLoading(true)
        try {
            const response = await axiosInstance.get("/subscription/plan/list");
            const products = response.data.plans.plans.filter((e: any) => {
                return e.status === 'ACTIVE'
            })
            setSubs(products);
            setLoading(false);
        } catch (error) {
            console.error("Error getting subscription plan:", error);
        }
    }

    async function deleteSub(id: string) {
        try {
            await axiosInstance.post("/subscription/delete", {
                plan_id: id
            });
            getSub()
        } catch (error) {
            console.error("Error getting subscription plan:", error);
        }
    }

    useEffect(() => {
        getSub()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            {
                loading ? (
                    <Loader className="animate-spin" ></Loader>
                ) : (
                    <div className="w-full">
                        {
                            editSub ? <div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Updated price</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder=""

                                                            type="number"
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-between">
                                            <Button variant={"secondary"} size={"sm"} onClick={() => setEditSub(null)}>Cancel</Button>
                                            <Button size={"sm"} type="submit">Submit</Button>
                                        </div>
                                    </form>
                                </Form>
                            </div> : <>
                                <div className="mb-4">
                                    <Button variant="secondary" size="sm" onClick={() => openNewSub(true)}>Add Subscription Plan</Button>
                                </div>
                                <Table>
                                    <TableCaption>A list of your created subscriptions on paypal</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Product ID</TableHead>
                                            <TableHead>Created at</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Delete</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subs?.map((plan: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{plan.name}</TableCell>
                                                <TableCell>{plan.id}</TableCell>
                                                <TableCell>{plan.product_id}</TableCell>
                                                <TableCell>{formatTimestamp(plan.create_time)}</TableCell>
                                                <TableCell>{plan.status}</TableCell>
                                                <TableCell>
                                                    <Button variant={"ghost"} size={"icon"} onClick={() => setEditSub(plan.id)}>
                                                        <Edit height={18}></Edit>
                                                    </Button>
                                                    <Button variant={"ghost"} size={"icon"} onClick={() => deleteSub(plan.id)}>
                                                        <Trash2 color="red" height={18}></Trash2>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table >
                            </>
                        }

                    </div>
                )
            }
        </div>

    )
}

export default SubscriptionList