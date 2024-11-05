import { Dispatch, useEffect, useState } from "react"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Textarea
} from "@/components/ui/textarea"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
interface Subscription {
    openNewSub: Dispatch<any>
}

const formSchema = z.object({
    price: z.coerce.number(),
    sub_name: z.string(),
    prod_id: z.string(),
    desc: z.string()
});

const SubscriptionCreationDialog: React.FC<Subscription> = ({ openNewSub }) => {
    const [products, setProducts] = useState([]);
    const axiosInstance = useAxiosWithToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axiosInstance.post("/subscription/plan/create", {
                "product_id": values.prod_id,
                "name": values.sub_name,
                "description": values.desc,
                "price": values.price.toString(),
                "currency": "USD"
            });
            openNewSub(false);
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    const fetchProduct = async () => {
        try {
            let product = await axiosInstance.get("/product/list");
            setProducts(product.data.products);
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                <FormField
                    control={form.control}
                    name="sub_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subscription name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""

                                    type="text"
                                    {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="prod_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        products.map((product: any) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the product you want to connect with</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
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

                <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder=""
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button type="button" onClick={() => openNewSub(false)}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </div>

            </form>
        </Form>
    )
}

export default SubscriptionCreationDialog

