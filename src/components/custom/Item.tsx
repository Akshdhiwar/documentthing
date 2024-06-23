import {  LucideIcon } from 'lucide-react'


type Props = {
    label: string,
    icon: LucideIcon,
    onClick: () => void,
}

const Item = ({ label, onClick, icon: Icon }: Props) => {
    return (
        <div role='button' className="w-full min-w-full group flex gap-1 text-muted-foreground font-medium rounded-md items-center justify-start py-1 px-2 hover:bg-primary/5 hover:text-black hover:cursor-pointer relative" onClick={() => onClick()}>
            <Icon className="h-[18px]"></Icon>
            <div className='flex-auto whitespace-nowrap min-w-0 overflow-hidden text-clip flex items-center'>
                <div className='whitespace-nowrap overflow-hidden text-ellipsis'>{label}</div>
            </div>
        </div>
    )
}

export default Item