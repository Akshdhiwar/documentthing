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
        if (selectedFile?.id) {
            const node = findNode(selectedFile.id);
            setActiveLink(node);
        }
    }, [selectedFile, version]);

    function goToNextPrevDoc(folder: Folder) {
        setActiveFolder(folder)
    }

    return (
        <div className="flex items-start justify-between pb-10">
            {activeLink?.prev ? (
                <Button variant={"secondary"} className="p-4 h-min flex justify-start group gap-2 min-w-2/12" onClick={() => { goToNextPrevDoc(activeLink.prev.data) }}>
                    <ChevronLeft className="text-muted-foreground" />
                    <div className="flex flex-col items-start">
                        <p className="text-muted-foreground" >PREVIOUS</p>
                        <p className="group-hover:underline">{activeLink.prev.data.name}</p>
                    </div>
                </Button>
            ) : <div></div>}
            {activeLink?.next ? (
                <Button variant={"secondary"} className="p-4 h-min flex justify-end gap-2 min-w-2/12 group" onClick={() => { goToNextPrevDoc(activeLink.next.data) }}>
                    <div className="flex flex-col items-end">
                        <p className="text-muted-foreground" >NEXT</p>
                        <p className="group-hover:underline">{activeLink.next.data.name}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground" />
                </Button>
            ) : <div></div>}
        </div>
    );
};

export default NextPrevious;
