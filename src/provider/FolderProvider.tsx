import { FolderContext } from '@/context/FolderContext'
import  { ReactNode, useEffect, useState } from 'react'
import axios from "axios"
import { WITH_BASIC_INIT_VALUE } from '@/constant/Editor'

type Props = {
    children: ReactNode
}

 async function createFile(){
    const response = await axios.post("http://localhost:3000/api/v1/file/create" , {file : JSON.stringify(WITH_BASIC_INIT_VALUE)})
    return response.data.id
 }

const FolderProvider = ({ children }: Props) => {

    const [folder, setFolder] = useState<any[] | []>([])
    const [selected , setSelected] = useState<FileObject>()

    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/folder/6689053c244c40e5323ac1dc").then(data=> {
            const res  = JSON.parse(data.data.folderStructure)
            setFolder(res)
        })
    },[])

    async function createPage(name: string) {
        let id = await createFile()
        let obj : FileObject = {
            id: crypto.randomUUID(),
            name: name,
            fileId : id,
            children: []
        }
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
        setFolder(updatedFolder)
    }

    useEffect(() => {
        axios.post("http://localhost:3000/api/v1/folder/6689053c244c40e5323ac1dc" , {folderStructure : JSON.stringify(folder)}).then(
            data => console.log(data.data)
        )
        console.log(folder)
    }, [folder])

    return (
        <FolderContext.Provider value={{ folder, createPage, addPage , selected , setSelected }}>{children}</FolderContext.Provider>
    )
}

export default FolderProvider

interface FileObject {
    id: string;
    name: string;
    fileId: string;
    children: FileObject[];
}