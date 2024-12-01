import { Button } from "@/components/ui/button"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="flex h-14 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <a href="" className="mr-4 flex items-center gap-2 text-lg lg:mr-6">
                        <span className="hidden font-bold lg:inline-block">DocumentThing</span>
                    </a>
                    <nav className="flex items-center gap-4 text-sm xl:gap-6">
                        <a href="" className="transition-colors hover:text-foreground/80 text-foreground/80">Features</a>
                        <a href="" className="transition-colors hover:text-foreground/80 text-foreground/80">Pricing</a>
                        <a href="" className="transition-colors hover:text-foreground/80 text-foreground/80">FAQ's</a>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
                    <Button variant={"ghost"} size={"sm"}>
                        Login
                    </Button>
                    <Button size={"sm"}>
                        SignUp
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header