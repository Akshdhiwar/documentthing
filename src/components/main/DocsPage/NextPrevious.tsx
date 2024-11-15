import { Button } from "@/components/ui/button";
import useFolderStore from "@/store/folderStore";
import useDoublyLinkedListStore from "@/store/nextPreviousLinks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const NextPrevious = () => {
    const { selectedFolder, setSelectedFolder } = useFolderStore((state) => state);
    const [activeLink, setActiveLink] = useState<any>(null);
    const findNode = useDoublyLinkedListStore(state => state.findById)
    const version = useDoublyLinkedListStore(state => state.version)

    useEffect(() => {
        if (selectedFolder?.id) {
            const node = findNode(selectedFolder.id);
            setActiveLink(node);
        }
    }, [selectedFolder, version]);

    function goToNextPrevDoc(folder: Folder) {
        setSelectedFolder(folder)
    }

    return (
        <div className="flex items-start justify-between pb-10 flex-col md:flex-row">
            {activeLink?.prev ? (
                <Button variant={"outline"} className="p-4 h-min flex justify-start group gap-2 min-w-2/12 w-full md:w-min" onClick={() => { goToNextPrevDoc(activeLink.prev.data) }}>
                    <ChevronLeft className="text-muted-foreground" />
                    <div className="flex flex-col items-start">
                        <p className="text-muted-foreground" >PREVIOUS</p>
                        <p className="group-hover:underline">{activeLink.prev.data.name}</p>
                    </div>
                </Button>
            ) : <div></div>}
            {activeLink?.next ? (
                <Button variant={"outline"} className="p-4 h-min flex justify-end gap-2 min-w-2/12 group w-full md:w-min" onClick={() => { goToNextPrevDoc(activeLink.next.data) }}>
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
