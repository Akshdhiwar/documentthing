import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import formatTimestamp from "@/shared/components/DateFormatter"
import useUserStore from "@/store/userStore"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

const Billing = () => {
    const axiosInstance = useAxiosWithToast()
    const [isLoading, setIsLoading] = useState(true)
    const { org } = useUserStore(state => state)
    let [details, setDetails] = useState<any>({})
    let [transactions, setTransactions] = useState<any>({})
    const [update , setUpdate] = useState(false)

    async function fetchDetails() {
        setIsLoading(true)
        const response = await axiosInstance.get(`/orgs/${org?.id}/billing/details`)
        setDetails({
            name: (await response).data.subscription_details.sub_name,
            maxCount: (await response).data.subscription_details.max_count,
            active: (await response).data.subscription_details.active_user,
            id: (await response).data.subscription_details.sub_id,
            nextDate: (await response).data.subscription_bill_details.billing_info.next_billing_time,
            status: (await response).data.subscription_bill_details.status
        })

        await axiosInstance.get(`/orgs/${org?.id}/billing/trasnsactions`).then(res => {
            setTransactions(res.data.transactions)
            console.log(res.data.transactions)
        })
        setIsLoading(false)
    }

    useEffect(() => {
        fetchDetails()
    }, [update])

    function cancel() {
        axiosInstance.post("/orgs/billing/cancel", {
            org_id: org?.id
        })
        setUpdate(state => !state)
    }
    function activate() {
        axiosInstance.post("/orgs/billing/activate", {
            org_id: org?.id
        })
        setUpdate(state => !state)
    }

    return (
        <div>
            {
                isLoading ?
                    <div className="flex justify-center items-center ">
                        <Loader className="animate-spin"></Loader>
                    </div> : <div className="flex flex-col gap-6">
                        <div className="shadow-lg p-4 rounded-lg bg-neutral-100">
                            <h3 className="text-xl font-bold">Subscription Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="my-2">
                                    <p className="tracking-tight text-muted-foreground">Subscription Plan</p>
                                    <p className="">{details.name}</p>
                                </div>
                                <div className="my-2">
                                    <p className="tracking-tight text-muted-foreground">Subsctiption ID</p>
                                    <p className="">{details.id}</p>
                                </div>
                                <div className="my-2">
                                    <p className="tracking-tight text-muted-foreground">Subscription user limit</p>
                                    <p className="">{details.maxCount}</p>
                                </div>
                                <div className="my-2">
                                    <p className="tracking-tight text-muted-foreground">Active Users</p>
                                    <p className="">{details.active}</p>
                                </div>
                            </div>
                            <div className="my-4">
                                <p className="tracking-tight text-muted-foreground">Next billing date</p>
                                <p className="">{formatTimestamp(details.nextDate)}</p>
                            </div>
                        </div>
                        <div className="shadow-lg p-4 rounded-lg bg-neutral-100">
                            <h3 className="text-xl font-bold">Subscription Transactions</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sr No.</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions?.map((t: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{1 + index}</TableCell>
                                            <TableCell>{t.payer_name.given_name}</TableCell>
                                            <TableCell>{t.id}</TableCell>
                                            <TableCell>{formatTimestamp(t.time)}</TableCell>
                                            <TableCell>${t.amount_with_breakdown.gross_amount.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table >
                        </div>
                        {
                            details.status === "ACTIVE" ? <div className="p-4 flex items-center gap-2">
                                <p className="tracking-tight text-muted-foreground">Suspend subscription?</p>
                                <Button variant="outline" size={"sm"} onClick={cancel}>Suspend Subscription</Button>
                            </div> :
                                <div className="p-4 flex items-center gap-2">
                                    <p className="tracking-tight text-muted-foreground">Activate subscription?</p>
                                    <Button variant="outline" size={"sm"} onClick={activate}>Activate Subscription</Button>
                                </div>
                        }
                    </div>
            }
        </div>

    )
}

export default Billing