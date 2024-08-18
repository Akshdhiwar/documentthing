interface Folder {
    id: string;
    name: string;
    fileId: string;
    children: Folder[];
}