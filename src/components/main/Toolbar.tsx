import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import NavigationSideBar from "./NavigationSideBar"

const Toolbar = () => {
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size={"icon"} variant={"ghost"}><Menu height={18} width={18}></Menu></Button>
                </SheetTrigger>
                <SheetContent className="p-0" side={"left"}>
                    <NavigationSideBar />
                </SheetContent>
            </Sheet>
        </div>

    )
}

export default Toolbar