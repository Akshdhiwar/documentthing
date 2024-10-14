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
import YPartyKitProvider from "y-partykit/provider";
import useUserStore from "@/store/userStore";
import * as Y from "yjs";


const BlockNoteEditor = () => {
    // State for page content and editor
    const [pageContent, setPageContent] = useState<PartialBlock[] | undefined>(undefined);
    const selectedFolder = useFolderStore((state) => state.selectedFolder);
    const { isEditing, editedFiles } = useEditChangesStore((state) => state);
    const project = useProjectStore((state) => state.project);
    const { setContent, setInitialContent ,setMarkdown } = useEditorStore((state) => state);
    const { user } = useUserStore(state => state)

    // create a function to get random bright hex code
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Editor instance
    const editor = useMemo(() => {
        let editor: any
        if (isEditing) {
            const doc = new Y.Doc();
            const provider = new YPartyKitProvider(
                "https://simpledoxs-party.akshdhiwar.partykit.dev",
                // use a unique name as a "room" for your application:
                project?.Id! + selectedFolder?.id,
                doc,
            );
            editor = BNE.create({
                collaboration: {
                    // The Yjs Provider responsible for transporting updates:
                    provider,
                    // Where to store BlockNote data in the Y.Doc:
                    fragment: doc.getXmlFragment("document-store"),
                    // Information (name and color) for this user:
                    user : {
                        name : user?.GithubName!,
                        color : getRandomColor()// blue color
                    }
                  }
            })
        } else {
            editor = BNE.create({
                initialContent: pageContent
            })
        }

        return editor
    }, [selectedFolder , isEditing , pageContent]);

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
