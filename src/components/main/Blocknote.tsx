import "@blocknote/core/fonts/inter.css";
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import { Alert } from "../custom/blocks/Alert/Alert";
import { RiAlertFill } from "react-icons/ri";
import { useContext, useEffect } from "react";
import { FolderContext } from "@/context/FolderContext";
import axiosInstance from "@/axios intercepter/axioshandler";

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
    blockSpecs: {
        // Adds all default blocks.
        ...defaultBlockSpecs,
        // Adds the Alert block.
        alert: Alert,
    },
});

// Slash menu item to insert an Alert block
const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Alert",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "alert",
        });
    },
    aliases: [
        "alert",
        "notification",
        "emphasize",
        "warning",
        "error",
        "info",
        "success",
    ],
    group: "Other",
    icon: <RiAlertFill />,
});


const Blocknote = () => {

    const folder = useContext(FolderContext)

    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        schema,
        initialContent: [
            {
                type: "paragraph",
                content: "Welcome to this demo!",
            },
            {
                type: "alert",
                content: "This is an example alert",
            },
            {
                type: "paragraph",
                content: "Press the '/' key to open the Slash Menu and add another",
            },
            {
                type: "paragraph",
            },
        ],
    });

    useEffect(() => {
        if (folder?.selected?.fileId === undefined) return
        axiosInstance.get(`/file/${folder.selected?.fileId}`).then(data => {
            let content = JSON.parse(data.data.content)
            editor.document.length = 0
            editor.document.push(...content)
        })
    }, [folder?.selected])

    // Renders the editor instance using a React component.
    return <div>
        <BlockNoteView editor={editor} theme={"light"} autoFocus={true} slashMenu={false}>
            <SuggestionMenuController
                triggerCharacter={"/"}
                getItems={async (query) =>
                    // Gets all default slash menu items and `insertAlert` item.
                    filterSuggestionItems(
                        [...getDefaultReactSlashMenuItems(editor), insertAlert(editor)],
                        query
                    )
                }
            />
        </BlockNoteView>
    </div>
}

export default Blocknote