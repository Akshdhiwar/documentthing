import { useState } from "react"
import SubscriptionList from "./SubscriptionList"
import SubscriptionCreationDialog from "./SubscriptionCreationDialog"

const SubscriptionPage = () => {

    const [newSub, setNewSub] = useState(false)

    return (
        <div>
            {
                !newSub ? <SubscriptionList openNewSub={setNewSub} /> : <SubscriptionCreationDialog openNewSub={setNewSub} />
            }
        </div>
    )
}

export default SubscriptionPage