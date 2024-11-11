import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { FileText, FolderOpen } from "lucide-react"
import React from "react"

type BreadcrumType = {
    UrlString: string
}

const BreadCrums: React.FC<BreadcrumType> = ({ UrlString }) => {
    if (!UrlString) return
    const resultArray = UrlString.split(" / ").map(str => str.trim());

    return (
        <div className="items-center gap-3 hidden lg:flex">
            {/* <FileText className="text-muted-foreground"></FileText> */}
            <Breadcrumb>
                <BreadcrumbList>
                    {/* <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="flex items-center">
                            <Home height={16}></Home>Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator></BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <FolderGit2 height={16}></FolderGit2>{project?.Name}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator></BreadcrumbSeparator> */}
                    {
                        resultArray.map((ele, index) => (
                            <div className="flex items-center " key={index}>
                                <BreadcrumbItem>
                                    {
                                        index !== resultArray.length - 1 ? <BreadcrumbLink className="flex gap-1 items-center"><FolderOpen height={16}></FolderOpen>{ele}</BreadcrumbLink> : <BreadcrumbPage className="flex gap-1 items-center"><FileText height={16}></FileText>{ele}</BreadcrumbPage>
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