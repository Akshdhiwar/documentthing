import { Button } from "@/components/ui/button";
import useEditorStore from "@/store/editorStore";

const ContentSideBar = () => {
    const { sidebarContents } = useEditorStore((state) => state);

    return (
        <div className="p-3 pt-0 text-sm ">
            <p className="font-medium">On This Page</p>
            {sidebarContents.map((content: any) => (
                <ul className="flex w-full m-0 list-none" key={content.id}>
                    <li className="mt-0 pt-2">
                        <a
                            href={`#${content?.value?.[0]?.id}`}
                            className="inline-block no-underline transition-colors hover:text-foreground text-muted-foreground"
                        >
                            {content?.value?.[0]?.children?.[0]?.text || "Untitled"}
                        </a>
                    </li>
                </ul>
            ))}
            <div className="flex flex-col gap-2 rounded-lg border p-4 text-sm mt-6 max-w-[80%]">
                <p className="text-balance text-lg font-semibold leading-tight group-hover:underline">
                    Bring your docs to life with DocumentThing
                </p>
                <div className="mb-3 text-muted-foreground m-0">
                    DocumentThing provides tools and infrastructure to create and share code documentation at scale.
                </div>
                <div className="mb-3 text-muted-foreground">
                    Trusted by developers and teams worldwide to simplify and publish documentation seamlessly.
                </div>
                <Button size={"sm"} className="w-min">
                    Get Started
                </Button>
            </div>
            {/* <div className="flex flex-col rounded-lg border px-4 py-2  max-w-[80%]">
                <div className="text-muted-foreground tracking-tighter text-sm">
                    powered by
                </div>
                <p className="text-balance text-lg leading-4  font-semibold group-hover:underline m-0">
                    DocumentThing
                </p>
            </div> */}
        </div>
    );
};

export default ContentSideBar;
