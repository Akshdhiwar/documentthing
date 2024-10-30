import { Button } from '@/components/ui/button';
import useAxiosWithToast from '@/shared/axios intercepter/axioshandler';
import {
    PayPalScriptProvider,
    PayPalButtons,
} from "@paypal/react-paypal-js";

const ProductCreation = () => {

    const axiosInstance = useAxiosWithToast();

    async function create() {
        try {
            await axiosInstance.post("/product/create", {
                name: "Basic Plan",
                description: "Basic",
            });
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }
    async function get() {
        try {
            await axiosInstance.get("/product/list");
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    async function createSub() {
        try {
            await axiosInstance.post("/subscription-plan/create", {
                "product_id": "PROD-31H43834X52262230",
                "name": "Pro Plan",
                "description": "Access to premium features",
                "price": "1.00",
                "currency": "USD"
            });
        } catch (error) {
            console.error("Error creating subscription plan:", error);
        }
    }

    async function getSub() {
        try {
            await axiosInstance.get("/subscription-plan/list");
        } catch (error) {
            console.error("Error getting subscription plan:", error);
        }
    }


    return (
        <div>
            <Button onClick={create}>CREATE Product</Button>
            <Button onClick={get}>GET Product</Button>
            <Button onClick={createSub}>Create Subscription plan</Button>
            <Button onClick={getSub}>Get Subscription plan</Button>
            <PayPalScriptProvider
                options={{
                    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                    components: "buttons",
                    intent: "subscription",
                    vault: true,
                }}
            >
                <PayPalButtons
                    createSubscription={(data:any, actions:any) => {
                        console.log(data)
                        // Check if actions.subscription.create exists before calling it
                        if (!actions || !actions.subscription || !actions.subscription.create) {
                            console.error("Subscription creation method is unavailable.");
                            return Promise.reject("Subscription creation is unavailable.");
                        }

                        return actions.subscription
                            .create({
                                plan_id: "P-5PA43779E3271994YM4QQDXQ", // Replace with your actual plan ID
                            })
                            .then((subscriptionId:string) => {
                                // Your code here after successfully creating the subscription
                                console.log("Subscription created with ID:", subscriptionId);
                                return subscriptionId;
                            })
                            .catch((error:any) => {
                                console.error("Error creating subscription:", error);
                            });
                    }}
                    style={{
                        label: "subscribe",
                    }}
                />
            </PayPalScriptProvider>

        </div>
    )
}

export default ProductCreation