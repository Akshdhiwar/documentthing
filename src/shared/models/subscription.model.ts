
interface SubscriptionPlan {
    title : string,
    featureList : FeatureListInterface[],
    price : number | string,
    popular : boolean,
    planID : string,
}

interface FeatureListInterface {
        feature : string
        excluded : boolean
}