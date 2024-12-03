import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()
    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="flex h-14 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <a href="" className="mr-4 flex items-center gap-2 text-lg lg:mr-6">
                        <span className="hidden font-bold lg:inline-block">DocumentThing</span>
                    </a>
                    <nav className="flex items-center gap-4 text-sm xl:gap-6">
                        <Button variant={"link"} onClick={() => scrollToSection("features")} className="transition-colors hover:text-foreground/80 text-foreground/80 p-0">Features</Button>
                        <Button variant={"link"} onClick={() => scrollToSection("pricing")} className="transition-colors hover:text-foreground/80 text-foreground/80 p-0">Pricing</Button>
                        <Button variant={"link"} onClick={() => scrollToSection("FAQ")} className="transition-colors hover:text-foreground/80 text-foreground/80 p-0">FAQ's</Button>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
                    <Button variant={"ghost"} size={"sm"} onClick={() => navigate("/account")}>
                        Login
                    </Button>
                    <Button size={"sm"} onClick={() => navigate("/account")}>
                        SignUp
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header