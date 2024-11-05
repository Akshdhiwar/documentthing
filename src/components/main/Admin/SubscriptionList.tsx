import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import formatTimestamp from "@/shared/components/DateFormatter"
import { Loader } from "lucide-react"
import { Dispatch, useEffect, useState } from "react"

interface Subscription {
    openNewSub : Dispatch<any>
}

const SubscriptionList:React.FC<Subscription> = ({openNewSub}) => {

    const [subs, setSubs] = useState<any>(undefined)
    const [loading, setLoading] = useState(true)
    const axiosInstance = useAxiosWithToast()

    async function getSub() {
        setLoading(true)
        try {
            const response = await axiosInstance.get("/subscription/plan/list");
            setSubs(response.data.plans.plans);
            setLoading(false);
        } catch (error) {
            console.error("Error getting subscription plan:", error);
        }
    }

    useEffect(() => {
        getSub()
    }, [])

    return (
        <div>
            {
                loading ? (
                    <Loader className="animate-spin" ></Loader>
                ) : (
                    <div className="w-full">
                        <div className="mb-4">
                            <Button variant="secondary" size="sm" onClick={()=>openNewSub(true)}>Add Subscription Plan</Button>
                        </div>
                        <Table>
                            <TableCaption>A list of your created products on paypal</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Created at</TableHead>
                                    <TableHead>Status</TableHead>
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