import axiosInstance from "@/shared/axios intercepter/axioshandler";
import useEditChangesStore from "@/store/changes";
import useEditorStore from "@/store/editorStore";
import useFolderStore from "@/store/folderStore";
import useProjectStore from "@/store/projectStore";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import { BlockNoteEditor as BNE, PartialBlock } from "@blocknote/core";
import FileSetter from "./FileSetter";

const BlockNoteEditor = () => {
    // State for page content and editor
    const [pageContent, setPageContent] = useState<PartialBlock[] | undefined>(undefined);
    const selectedFolder = useFolderStore((state) => state.selectedFolder);
    const { isEditing, editedFiles } = useEditChangesStore((state) => state);
    const project = useProjectStore((state) => state.project);
    const { setContent , setInitialContent , setMarkdown } = useEditorStore((state) => state);

    // Editor instance
    const editor = useMemo(() => {
        const editor = BNE.create({ initialContent : pageContent });
        return editor
    }, [pageContent]);

    useEffect(() => {
        if (!selectedFolder?.id) return;

        const editedFile = editedFiles.find((file) => file.id === selectedFolder.id);

        if (editedFile) {
            setPageContent(editedFile.changedContent);
            setInitialContent(editedFile.changedContent);
            return;
        }

        // Fetch file content if not found in the edited files
        axiosInstance
            .get(`/file/get`, {
                params: {
                    proj: project?.Id,
                    file: selectedFolder?.id,
                },
            })
            .then((response) => {
                let base64 = response.data;
                if (!base64) {
                    setPageContent([]);
                    return;
                }
                let content = atob(base64);
                let obj = JSON.parse(content);
                setPageContent(obj);
                setInitialContent(obj)
            })
            .catch((error) => {
                console.error("Error fetching file content:", error);
            });
    }, [selectedFolder]);

    const onChange = async () => {
        // Converts the editor's contents from Block objects to Markdown and store to state.
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        setContent(editor.document);
        setMarkdown(markdown);
      };

    // Render the editor only when it's ready
    return (
        <>
            {editor && (
                <BlockNoteView
                    editor={editor}
                    theme={"light"}
                    editable={isEditing}
                    onChange={onChange}
                />
            )}
            <FileSetter />
        </>
    );
};

export default BlockNoteEditor;
