
interface SubscriptionPlan {
    title : string,
    featureList : FeatureListInterface[],
    price : number | string,
    popular : boolean,
    planID : string,
    initialQuantity : string
}

interface FeatureListInterface {
        feature : string
        excluded : boolean
}