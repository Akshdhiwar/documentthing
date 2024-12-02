import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";

export function GetStarted() {
    return (
        <div className="p-8 max-w-7xl mx-auto w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
            <div className="max-w-4xl mx-auto p-4 text-center text-white">
                <p className="text-3xl font-semibold tracking-tight">
                    Get Started with Ease
                </p>
                <p className="text-muted-foreground my-7">
                    Take the first step towards transforming your documentation process. Create, collaborate, and publish your code docs seamlessly with our platform. Whether you’re a solo developer or part of a growing team, we’ve got the tools to make your work shine.
                </p>
                <Button className="z-50">Login / Signup</Button>
            </div>
            <BackgroundBeams />
        </div>
    );
}
