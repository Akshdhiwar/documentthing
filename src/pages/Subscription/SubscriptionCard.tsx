import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SubscriptionCardInterface {
    details: SubscriptionPlan,
    paymentPage: boolean
}


const SubscriptionCard: React.FC<SubscriptionCardInterface> = ({ details, paymentPage }) => {

    const navigate = useNavigate()

    function navigateToSubscriptionPage() {
        navigate(`/account/subscription/payment`, {
            state: {
                planID: details.planID
            }
        })
    }

    return (
        <div className={`p-3 flex flex-col gap-2 h-full ${details.popular && "border rounded-lg shadow-md bg-slate-100"} `}>
            <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-2xl tracking-tighter mt-2">{details.title}{details.popular}</p>
                {details.popular && <Badge> <Sparkles height={18} className="animate-pulse"></Sparkles>Most Popular</Badge>}
            </div>
            <div className="tracking-wide flex flex-col gap-1 text-sm font-semibold text-slate-700 flex-1">
                {
                    details.featureList.map((feature, index) => (
                        <div key={index} className={`flex gap-1 ${feature.excluded ? "text-slate-400" : ""}`}><Check height={18} className={`mt-1 min-w-6 ${!feature.excluded && "text-green-500"}`}></Check> <p className="m-0">{feature.feature}</p> </div>
                    ))
                }
            </div>
            <div>
                <p><span className="text-sm">$</span><span className="font-bold text-2xl">{details.price}</span><span className="text-muted-foreground text-sm">/user</span></p>
            </div>
            {
                !paymentPage && <Button onClick={navigateToSubscriptionPage} className="w-full mt-2" variant="expandIcon" size={"sm"} Icon={ChevronRight} iconPlacement="right">Continue</Button>
            }
        </div>

    )
}

export default SubscriptionCard