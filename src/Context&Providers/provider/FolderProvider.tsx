import { FolderContext } from '@/Context&Providers/context/FolderContext'
import  { ReactNode, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '@/shared/axios intercepter/axioshandler'
import { UserContext } from '../context/UserContext'

type Props = {
    children: ReactNode
}

const FolderProvider = ({ children }: Props) => {

    const {folderId} = useParams()
    const user = useContext(UserContext)
    const [folder, setFolder] = useState<any[] | []>([])
    const [selected , setSelected] = useState<FileObject>()
    let sha = ""

    async function createPage(name: string) {
        let obj : FileObject = {
            id: crypto.randomUUID(),
            name: name,
            fileId : crypto.randomUUID(),
            children: []
        }
        let data = await saveFolderStructure([...folder, obj] , obj.fileId)
        console.log(data)
        setFolder(prev => [...prev, obj])
    }

    function recursive(name: any, id: any, folder: any , obj : any) {
        return folder.map((node: any) => {
            if (node.id === id) {
                return { ...node, children: [...node.children, obj] }
            } else if (node.children.length > 0 && node.id !== id) {
                return { ...node, children: recursive(name, id, node.children , obj)}
            }
            return node
        })
    }

    async function addPage(name: any, id: any) {
        let obj : FileObject = {
            id: crypto.randomUUID(),
            name: name,
            fileId : crypto.randomUUID(),
            children: []
        }
        const updatedFolder = recursive(name, id, folder , obj);
        let data = await saveFolderStructure(updatedFolder , obj.fileId)
        console.log(data)
        setFolder(updatedFolder)
    }

    async function saveFolderStructure(folderStructure : any[] , fileID : string){
        const response = await axiosInstance.post(`/folder/update` , {
            folder_object : btoa(JSON.stringify(folderStructure)),
            id : folderId,
            file_id : fileID,
            sha : sha
        })
        return response.status
    }

    return (
        <FolderContext.Provider value={{ folder, createPage, addPage , selected , setSelected , setFolder , sha }}>{children}</FolderContext.Provider>
    )
}

export default FolderProvider

interface FileObject {
    id: string;
    name: string;
    fileId: string;
    children: FileObject[];
}

//   https://stackoverflow.com/questions/34011782/how-to-resolve-conflict-with-merging-with-github-api