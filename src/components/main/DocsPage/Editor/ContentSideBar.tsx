import useEditorStore from "@/store/editorStore";

const ContentSideBar = () => {
    const { sidebarContents } = useEditorStore((state) => state);

    return (
        <div className="p-3 pt-0 text-sm">
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
        </div>
    );
};

export default ContentSideBar;
