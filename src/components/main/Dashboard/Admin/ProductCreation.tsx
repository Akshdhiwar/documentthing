import { Button } from '@/components/ui/button';
import useAxiosWithToast from '@/shared/axios intercepter/axioshandler';
import useUserStore from '@/store/userStore';

const ProductCreation = () => {

    const axiosInstance = useAxiosWithToast();
    const { org } = useUserStore(state => state)

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
            await axiosInstance.post("/subscription/plan/create", {
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
            await axiosInstance.get("/subscription/plan/list");
        } catch (error) {
            console.error("Error getting subscription plan:", error);
        }
    }

    async function getSubDetails() {
        try {
            await axiosInstance.get(`/subscription/details/${org?.id}`);
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
            <Button onClick={getSubDetails}>Get Subscription Details</Button>
        </div>
    )
}

export default ProductCreation