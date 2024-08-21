import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {  FileText } from "lucide-react"
import React from "react"

type BreadcrumType = {
    UrlString: string
}

const BreadCrums: React.FC<BreadcrumType> = ({ UrlString }) => {

    const resultArray = UrlString.split(" / ").map(str => str.trim());

    return (
        <div className="flex items-center gap-3">
            <FileText className="text-muted-foreground"></FileText>
            <Breadcrumb>
                <BreadcrumbList>
                    {
                        resultArray.map((ele, index) => (
                            <div className="flex items-center ">
                                <BreadcrumbItem>
                                    {
                                        index !== resultArray.length - 1 ? <BreadcrumbLink>{ele}</BreadcrumbLink> : <BreadcrumbPage>{ele}</BreadcrumbPage>
                                    }
                                </BreadcrumbItem>
                                {
                                    index !== resultArray.length - 1 && <BreadcrumbSeparator className="ml-2" />
                                }
                            </div>
                        ))

                    }
                </BreadcrumbList>
            </Breadcrumb>
        </div>

    )
}

export default BreadCrums