import { Button } from "@/components/ui/button";
import useFolderStore from "@/store/folderStore";
import useDoublyLinkedListStore from "@/store/nextPreviousLinks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const NextPrevious = () => {
    const selectedFile = useFolderStore((state) => state.selectedFolder);
    const [activeLink, setActiveLink] = useState<any>(null);
    const setActiveFolder = useFolderStore(state => state.setSelectedFolder)
    const findNode = useDoublyLinkedListStore(state => state.findById)
    const version = useDoublyLinkedListStore(state => state.version)

    useEffect(() => {
        if (selectedFile?.fileId) {
            const node = findNode(selectedFile.fileId);
            setActiveLink(node);
        }
    }, [selectedFile ,version ]);

    function goToNextPrevDoc(folder: Folder) {
        setActiveFolder(folder)
    }

    return (
        <div className="flex items-start justify-between pb-10">
            {activeLink?.prev ? (
                <Button variant={"ghost"} className="p-4 flex gap-2" onClick={() => { goToNextPrevDoc(activeLink.prev.data) }}>
                    <ChevronLeft className="text-muted-foreground" />
                    <p>{activeLink.prev.data.name}</p>
                </Button>
            ) : <div></div>}
            {activeLink?.next ? (
                <Button variant={"ghost"} className="p-4 flex gap-2" onClick={() => { goToNextPrevDoc(activeLink.next.data) }}>
                    <p>{activeLink.next.data.name}</p>
                    <ChevronRight className="text-muted-foreground" />
                </Button>
            ) : <div></div>}
        </div>
    );
};

export default NextPrevious;
