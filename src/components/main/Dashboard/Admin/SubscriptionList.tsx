import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import formatTimestamp from "@/shared/components/DateFormatter"
import { Loader, Trash2 } from "lucide-react"
import { Dispatch, useEffect, useState } from "react"

interface Subscription {
    openNewSub: Dispatch<any>
}

const SubscriptionList: React.FC<Subscription> = ({ openNewSub }) => {

    const [subs, setSubs] = useState<any>(undefined)
    const [loading, setLoading] = useState(true)
    const axiosInstance = useAxiosWithToast()

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
                                        <TableCell><Button variant={"ghost"} size={"icon"} onClick={() => deleteSub(plan.id)}><Trash2 color="red" height={18}></Trash2></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table >
                    </div>
                )
            }
        </div>

    )
}

export default SubscriptionList