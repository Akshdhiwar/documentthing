
interface SubscriptionPlan {
    title : string,
    featureList : FeatureListInterface[],
    price : number | string,
    popular : boolean,
    planID : string,
    maxUser : number
}

interface FeatureListInterface {
        feature : string
        excluded : boolean
}