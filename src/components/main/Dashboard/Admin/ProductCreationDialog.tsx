import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import { Dispatch, useRef } from "react";

interface DialogInt {
    setOpen: Dispatch<any>
}

const ProductCreationDialog: React.FC<DialogInt> = ({ setOpen }) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descInputRef = useRef<HTMLInputElement>(null);
    const axiosInstance = useAxiosWithToast();

    async function submit(event: any) {
        event.preventDefault(); // Prevent default form submission

        if (!nameInputRef.current || !descInputRef.current) return;

        try {
            await axiosInstance.post("/product/create", {
                name: nameInputRef.current.value,
                description: descInputRef.current.value,
            });
            setOpen(false); // Close the dialog after successful creation
            console.log("Product created successfully");
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
                <DialogDescription>
                    Add the product to create a subscription plan on PayPal
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input ref={nameInputRef} id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Input ref={descInputRef} id="description" className="col-span-3" />
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>

    );
}

export default ProductCreationDialog;
