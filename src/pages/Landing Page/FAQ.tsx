import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQ = () => {
    return (
        <div className="my-20 max-w-4xl mx-auto" id="FAQ">
            <div className="text-center">
                <p className="font-semibold text-3xl mb-8">FAQ's</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Why am I able to see "Documentthing" folder inside my Github repo?</AccordionTrigger>
                    <AccordionContent>
                        So, documentthing saves each document in 2 different formats. Markdown and JSON , markdown format are for users to read directly on github . But the JSON format are used by documentthing app to display the pages and to edit it.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Are markdown formats lossy?</AccordionTrigger>
                    <AccordionContent>
                        Yes. Markdown formats are lossy that's why we use JSON format to show the data so all the components like Callout .
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Will we get new feature updates?</AccordionTrigger>
                    <AccordionContent>
                        Yes, there will be more feature upgrades. Publisable Docs , Git-branching , Excali-draw Integration and many more features are on the way.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>What about support?</AccordionTrigger>
                    <AccordionContent>
                        Will be creating discord channels and mail-support.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

    )
}

export default FAQ