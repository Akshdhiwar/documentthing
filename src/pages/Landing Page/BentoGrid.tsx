import { FollowerPointerCard } from "@/components/ui/following-pointer"
import { Download, Github, Globe, MessageCircle, Text } from "lucide-react"

const BentoGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto mt-10 border">
            <div className="p-2 md:col-span-2 border-b"></div>
            <div className="p-8 flex flex-col border-b border-r">
                <div className="flex-1 flex flex-col">
                    <div className="flex gap-1 items-center text-muted-foreground"><Github height={20}></Github><p>Github Integration</p></div>
                    <div className="my-5 flex-1 flex flex-col justify-center">
                        <p className="text-2xl font-semibold tracking-tight">Seemlesly connects with github</p>
                        <p className="text-xl text-muted-foreground ">Create, edit files on documentthing gets saved in your github repo</p>
                    </div>
                </div>
                <div>
                    <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnIzZW40a2d3eTV6ZjNpYWxjY2hhZzFnYnA2ZDcwNmx6eG10aHE5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/W12WAzuqod9VS/giphy.webp" alt="" className='w-full' />
                </div>
            </div>
            <div className="p-8 flex flex-col  border-b">
                <div className="flex-1 flex flex-col">
                    <div className="flex gap-1 items-center text-muted-foreground"><MessageCircle height={20}></MessageCircle><p>Collaborative environment</p></div>
                    <div className="my-5 flex-1 flex flex-col justify-center">
                        <p className="text-2xl font-semibold tracking-tight">Work with your team-mates</p>
                        <p className="text-xl text-muted-foreground">Connect documentthing to Github organization and invite your mates</p>
                    </div>
                </div>
                <FollowerPointerCard>
                    <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnIzZW40a2d3eTV6ZjNpYWxjY2hhZzFnYnA2ZDcwNmx6eG10aHE5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/W12WAzuqod9VS/giphy.webp" alt="" className='w-full' />
                </FollowerPointerCard>
            </div>
            <div className="p-8 flex flex-col md:col-span-2 border-b">
                <div className="flex-1 flex flex-col">
                    <div className="flex gap-1 items-center text-muted-foreground"><Text height={20}></Text><p>Rich Text-Editor</p></div>
                    <div className="my-5 flex-1 flex flex-col justify-center">
                        <p className="text-2xl font-semibold tracking-tight">Notion like Text Editor</p>
                        <p className="text-xl text-muted-foreground ">Craft your documentation with ease using our powerful and user-friendly editor</p>
                    </div>
                </div>
                <div>
                    <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnIzZW40a2d3eTV6ZjNpYWxjY2hhZzFnYnA2ZDcwNmx6eG10aHE5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/W12WAzuqod9VS/giphy.webp" alt="" className='w-full' />
                </div>
            </div>
            <div className="p-8 flex flex-col border-r border-b">
                <div className="flex-1 flex flex-col">
                    <div className="flex gap-1 items-center text-muted-foreground"><Globe height={20}></Globe><p>Publish Docs (Under Development)</p></div>
                    <div className="my-5 flex-1 flex flex-col justify-center">
                        <p className="text-2xl font-semibold tracking-tight">Publish Your Documentation with One Click</p>
                        <p className="text-xl text-muted-foreground">Turn your work into a professional online document effortlessly</p>
                    </div>
                </div>
                <div>
                    <img src="./world.svg" alt="" />
                </div>
            </div>
            <div className="p-8 flex flex-col border-b">
                <div className="flex-1 flex flex-col">
                    <div className="flex gap-1 items-center text-muted-foreground"><Download height={20}></Download><p>Exports</p></div>
                    <div className="my-5 flex-1 flex flex-col justify-center">
                        <p className="text-2xl font-semibold tracking-tight">Flexible Export Options</p>
                        <p className="text-xl text-muted-foreground">Take your documentation wherever you need it with easy export options.</p>
                    </div>
                </div>
                <div>
                    <img src="./world.svg" alt="" />
                </div>
            </div>
            <div className="p-2 md:col-span-2 border-b"></div>
            <div className="p-8 flex items-center justify-center md:col-span-2 font-semibold text-lg tracking-wider">
                🚀 We're just getting started—exciting new features are on the horizon!
            </div>
        </div>
    )
}

export default BentoGrid