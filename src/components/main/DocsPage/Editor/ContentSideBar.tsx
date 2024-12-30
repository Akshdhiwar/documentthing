import useEditorStore from "@/store/editorStore";

const ContentSideBar = () => {
    const { sidebarContents } = useEditorStore((state) => state);

    return (
        <div className="p-3 pt-0 text-muted-foreground font-light">
            {sidebarContents.reverse().map((content: any) => (
                <div className="flex w-full" key={content.id}>
                    <a
                        href={`#${content?.value?.[0]?.id}`}
                        className="flex flex-1 basis-0 truncate hover:text-secondary-foreground hover:cursor-pointer hover:underline"
                    >
                        {content?.value?.[0]?.children?.[0]?.text || "Untitled"}
                    </a>
                </div>
            ))}
        </div>
    );
};

export default ContentSideBar;
