
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group"

const Folder = () => {

    const folderStructure = [
        {
            title: "Introduction",
            type: "button"
        },
        {
            title: "Module",
            type: "accordian",
            subfolder: [
                {
                    title: "Core Module",
                    type: "button"
                },
                {
                    title: "Main Module",
                    type: "button"
                }
            ]
        }
    ]

    return (
        <div className="w-full">
            <ToggleGroup type="single" className="flex flex-col justify-start items-start w-[250px] outline-1 outline outline-blue-500">{
                folderStructure.map((ele) => (
                    <div>
                        {
                            ele.type === "button" ? <ToggleGroupItem value={ele.title} className="w-[250px] flex justify-start" >{ele.title}</ToggleGroupItem > :
                                <Accordion type="single" collapsible className="w-[250px]">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="p-2">{ele.title}</AccordionTrigger>
                                        {
                                            ele.subfolder?.map((ele) => (
                                                <AccordionContent>
                                                    <ToggleGroupItem value={ele.title} className="w-[250px] flex justify-start">{ele.title}</ToggleGroupItem >
                                                </AccordionContent>
                                            ))
                                        }

                                    </AccordionItem>
                                </Accordion>
                        }
                    </div>
                ))
            }</ToggleGroup></div>
    )
}

export default Folder