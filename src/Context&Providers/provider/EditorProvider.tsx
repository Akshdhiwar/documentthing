import { EditorContext } from '@/Context&Providers/context/EditorContext'
import { ReactNode, useState } from 'react'

type Props = {
    children: ReactNode
}

const EditorProvider = ({ children }: Props) => {

    const [editor, setEditor] = useState(null)

    return (
        <EditorContext.Provider value={{ editor, setEditor }}>{children}</EditorContext.Provider>
    )
}

export default EditorProvider