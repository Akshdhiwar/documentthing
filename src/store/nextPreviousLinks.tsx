import { create } from 'zustand';

// Define the Node type
type Node = {
    data: any;
    next: Node | null;
    prev: Node | null;
};

// Define the store state and actions
type DoublyLinkedListState = {
    head: Node | null;
    tail: Node | null;
    append: (data: any) => void;
    convertIntoLinkedList: (data: Folder[]) => void;
    findById: (fileID: any) => Node | null;
    clearList: () => void;
    goToNext: (node: Node) => Node | null;
    goToPrevious: (node: Node) => Node | null;
    version: number
};

// Create the Zustand store
const useDoublyLinkedListStore = create<DoublyLinkedListState>((set, get) => ({
    head: null,
    tail: null,
    version: 0,
    append: (data: any) => {
        const newNode: Node = { data, next: null, prev: null };
        const { head, tail } = get();

        if (!head) {
            set({ head: newNode, tail: newNode });
        } else {
            tail!.next = newNode;
            newNode.prev = tail;
            set({ tail: newNode });
        }
    },

    convertIntoLinkedList: (data: Folder[]) => {
        const { append } = get();

        function convertData(data: Folder[]) {
            data.forEach((element: Folder) => {
                append(element);
                if (element.children.length > 0) {
                    convertData(element.children);
                }
            });
        }

        convertData(data);
        set((state)=>({ version: state.version + 1 }));
    },

    findById: (fileID: any) => {
        let current = get().head;
        while (current) {
            if (current.data.fileId === fileID) {
                return current;
            }
            current = current.next;
        }
        return null;
    },

    clearList: () => {
        let current = get().head;

        while (current) {
            const nextNode = current.next;
            current.data = null;
            current.prev = null;
            current.next = null;
            current = nextNode;
        }

        set({ head: null, tail: null });
    },

    goToNext: (node: Node) => {
        return node.next;
    },

    goToPrevious: (node: Node) => {
        return node.prev;
    },
}));

export default useDoublyLinkedListStore;
