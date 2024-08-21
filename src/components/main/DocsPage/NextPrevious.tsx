import { Button } from "@/components/ui/button";
import useFolderStore from "@/store/folderStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { linkedList } from "./Links";

const NextPrevious = () => {
    const selectedFile = useFolderStore((state) => state.selectedFolder);
    const [activeLink, setActiveLink] = useState<any>(null);
    const setActiveFolder = useFolderStore(state => state.setSelectedFolder)

    useEffect(() => {
        if (selectedFile?.fileId) {
            const node = linkedList.findNode(selectedFile.fileId);
            setActiveLink(node);
        }
    }, [selectedFile]);

    function goToNextPrevDoc(folder: Folder) {
        setActiveFolder(folder)
    }

    return (
        <div className="flex items-start justify-between">
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
