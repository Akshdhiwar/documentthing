import { FolderContext } from '@/context/FolderContext'
import  { ReactNode, useState } from 'react'
import axios from "axios"
import { WITH_BASIC_INIT_VALUE } from '@/constant/Editor'
import { useParams } from 'react-router-dom'
import axiosInstance from '@/axios intercepter/axioshandler'

type Props = {
    children: ReactNode
}

 async function createFile(){
    const response = await axios.post("http://localhost:3000/api/v1/file/create" , {file : JSON.stringify(WITH_BASIC_INIT_VALUE)})
    return response.data.id
 }

const FolderProvider = ({ children }: Props) => {

    const {folderId} = useParams()

    const [folder, setFolder] = useState<any[] | []>([])
    const [selected , setSelected] = useState<FileObject>()

    async function createPage(name: string) {
        let id = await createFile()
        let obj : FileObject = {
            id: crypto.randomUUID(),
            name: name,
            fileId : id,
            children: []
        }
        let data = await saveFolderStructure([...folder, obj])
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
        let fid = await createFile()
        let obj : FileObject = {
            id: crypto.randomUUID(),
            name: name,
            fileId : fid,
            children: []
        }
        const updatedFolder = recursive(name, id, folder , obj);
        let data = await saveFolderStructure(updatedFolder)
        console.log(data)
        setFolder(updatedFolder)
    }

    async function saveFolderStructure(folderStructure : any[]){
        const response = await axiosInstance.post(`/folder/${folderId}` , {folderStructure : JSON.stringify(folderStructure)})
        return response.status
    }

    return (
        <FolderContext.Provider value={{ folder, createPage, addPage , selected , setSelected , setFolder }}>{children}</FolderContext.Provider>
    )
}

export default FolderProvider

interface FileObject {
    id: string;
    name: string;
    fileId: string;
    children: FileObject[];
}