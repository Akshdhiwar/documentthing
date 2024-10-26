import { Button } from '@/components/ui/button';
import useAxiosWithToast from '@/shared/axios intercepter/axioshandler';

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


    return (
        <div>
            <Button onClick={create}>CREATE Product</Button>
            <Button onClick={get}>GET Product</Button>
        </div>
    )
}

export default ProductCreation