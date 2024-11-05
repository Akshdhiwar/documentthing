import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler"
import formatTimestamp from "@/shared/components/DateFormatter";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCreationDialog from "./ProductCreationDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const ProductPage = () => {
    const [products, setProducts] = useState<any>(undefined)
    const [loading, setLoading] = useState(true)
    const axiosInstance = useAxiosWithToast()
    const [open, setOpen] = useState(false)

    const fetchProduct = async () => {
        setLoading(true);
        try {
            let product = await axiosInstance.get("/product/list");
            setProducts(product.data.products);
            setLoading(false);
        } catch (error) {
            console.error("Error creating product:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(open) return
        fetchProduct()
    }, [open])

    return (
        <div className="flex flex-col items-center justify-center">
            {loading ? (
                <Loader className="animate-spin"></Loader>
            ) : (
                <div className="w-full">
                    <div className="mb-4">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm">Add Product</Button>
                            </DialogTrigger>
                            <ProductCreationDialog setOpen={setOpen} />
                        </Dialog>
                    </div>
                    <Table>
                        <TableCaption>A list of your created products on paypal</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sr No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Created at</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((product: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{formatTimestamp(product.create_time)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table >
                </div>
            )}
        </div >
    )
}

export default ProductPage