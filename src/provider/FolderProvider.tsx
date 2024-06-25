import { FolderContext } from '@/context/FolderContext'
import  { ReactNode, useEffect, useState } from 'react'

type Props = {
    children: ReactNode
}

const FolderProvider = ({ children }: Props) => {

    const [folder, setFolder] = useState<any[] | []>([])

    function createPage(name: string) {
        let obj = {
            id: crypto.randomUUID(),
            name: name,
            children: []
        }
        setFolder(prev => [...prev, obj])
    }

    function recursive(name: any, id: any, folder: any) {
        return folder.map((node: any) => {
            if (node.id === id) {
                return { ...node, children: [...node.children, { id: crypto.randomUUID(), name: name, children: [] }] }
            } else if (node.children.length > 0 && node.id !== id) {
                return { ...node, children: recursive(name, id, node.children)}
            }
            return node
        })
    }

    function addPage(name: any, id: any) {
        const updatedFolder = recursive(name, id, folder);
        setFolder(updatedFolder)
    }

    useEffect(() => {
        console.log(folder)
    }, [folder])

    return (
        <FolderContext.Provider value={{ folder, createPage, addPage }}>{children}</FolderContext.Provider>
    )
}

export default FolderProvider