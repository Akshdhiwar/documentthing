import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import CustomToggle from "../../custom/CustomAccordian"
import Tree from "@/components/custom/Tree"

type Props = {
  folder: any[]
}

const FolderStructure = ({ folder }: Props) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Document</SidebarGroupLabel>
      <SidebarGroupContent>
        {
          folder.map((child: any, index) => (
            <Tree key={index} item={child} />
          ))
        }
      </SidebarGroupContent>
    </SidebarGroup >
  )
}

export default FolderStructure