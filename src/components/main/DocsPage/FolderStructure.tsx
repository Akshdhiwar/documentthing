import CustomToggle from "../../custom/CustomAccordian"

type Props = {
  folder: any[]
}

const FolderStructure = ({ folder }: Props) => {
  return (
    <div className="py-1">
      {
        folder.map((child: any , index) => (
          <CustomToggle key={index} child={child} />
        ))
      }
    </div >
  )
}

export default FolderStructure