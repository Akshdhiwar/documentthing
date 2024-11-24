import useEditChangesStore from "@/store/changes";
import useEditorStore from "@/store/editorStore";
import useFolderStore from "@/store/folderStore";
import useProjectStore from "@/store/projectStore";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { BlockNoteEditor as BNE, PartialBlock } from "@blocknote/core";
import FileSetter from "./FileSetter";
import YPartyKitProvider from "y-partykit/provider";
import useUserStore from "@/store/userStore";
import * as Y from "yjs";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";

const BlockNoteEditor = () => {
    const axiosInstance = useAxiosWithToast();
    const [pageContent, setPageContent] = useState<PartialBlock[] | undefined>(undefined);
    const selectedFolder = useFolderStore((state) => state.selectedFolder);
    const { isEditing, editedFiles } = useEditChangesStore((state) => state);
    const project = useProjectStore((state) => state.project);
    const { setContent, setInitialContent, setMarkdown, setEditor } = useEditorStore((state) => state);
    const { user } = useUserStore((state) => state);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Memoize color generation to avoid recalculating
    const getRandomColor = useCallback(() => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }, []);

    // Editor instance
    const editor = useMemo(() => {
        if (!selectedFolder || !project || !pageContent) return null;

        const doc = new Y.Doc();
        const editorOptions = isEditing ? {
            collaboration: {
                provider: new YPartyKitProvider(
                    "https://simpledoxs-party.akshdhiwar.partykit.dev",
                    project.Id + selectedFolder.id,
                    doc,
                ),
                fragment: doc.getXmlFragment("document-store"),
                user: {
                    name: user?.GithubName || "Guest",
                    color: getRandomColor(),
                },
            }
        } : {
            initialContent: pageContent,
        };

        return BNE.create(editorOptions);
    }, [selectedFolder, isEditing, pageContent]);

    // Fetch initial file content
    useEffect(() => {
        if (!selectedFolder?.id) return;
        if (isEditing) {
            const editedFile = editedFiles.find((file) => file.id === selectedFolder.id);
            if (editedFile) {
                setPageContent(editedFile.changedContent);
                setInitialContent(editedFile.changedContent);
                return;
            }
        }

        // Fetch file content if not found in the edited files
        axiosInstance
            .get(`/file/get`, {
                params: {
                    proj: project?.Id,
                    file: selectedFolder?.id,
                    t : user?.Type
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

    const onChange = useCallback(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            const markdown = await editor?.blocksToMarkdownLossy(editor.document);
            setEditor(editor);
            setContent(editor?.document);
            setMarkdown(markdown);
        }, 300); // Adjust the delay as needed
    }, [editor]);

    // Render the editor only when it's ready
    return (
        <>
            {editor && (
                <BlockNoteView
                    editor={editor}
                    theme="light"
                    editable={isEditing}
                    onChange={onChange}
                />
            )}
            <FileSetter />
        </>
    );
};

export default BlockNoteEditor;
