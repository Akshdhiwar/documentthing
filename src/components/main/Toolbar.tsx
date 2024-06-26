import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import NavigationSideBar from "./NavigationSideBar"

const Toolbar = () => {
    return (
        <div className="p-1">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size={"icon"} className="p-1" variant={"ghost"}><Menu height={18} width={18}></Menu></Button>
                </SheetTrigger>
                <SheetContent className="p-0" side={"left"}>
                    <NavigationSideBar />
                </SheetContent>
            </Sheet>
        </div>

    )
}

export default Toolbar