import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import Tree from "@/components/custom/Tree"
import { Button } from "@/components/ui/button"
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalDescription } from "@/components/ui/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import useFolderStore from "@/store/folderStore"
import useAddFolderContext from "@/shared/custom hooks/useDialogContext"

type Props = {
  folder: any[]
}
const formSchema = z.object({
  name: z.string()
});

const FolderStructure = ({ folder }: Props) => {

  const dialog = useAddFolderContext()
  const { createPage, addPage, isNoFilePresent } = useFolderStore(state => state)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" }, // Ensure 'name' starts as an empty string

  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (dialog?.id) {
        addPage(values.name, dialog?.id);
        dialog.setId(null)
        // form.reset()
        // dialog.close()
      } else {
        createPage(values.name)
        // dialog.close()
        // form.reset()
      }
      dialog.close()
    } catch (error) {
      dialog.close()
      console.error("Form submission error", error);
    }
  }

  return (
    <div>
      {isNoFilePresent ? <div className="flex-1 m-2 flex items-center justify-center text-center">
        <p className="text-muted-foreground">Look's like no file is been created</p>
      </div> : <SidebarGroup>
        <SidebarGroupLabel>Document</SidebarGroupLabel>
        <SidebarGroupContent>
          {
            folder.map((child: any, index) => (
              <Tree key={index} item={child} />
            ))
          }
        </SidebarGroupContent>
      </SidebarGroup >}
      <ResponsiveModal open={dialog?.isOpen} onOpenChange={dialog.setIsOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Are you absolutely sure?</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              This action cannot be undone. This will permanently delete your account and remove your
              data from our servers.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New page name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Introduction"

                        type="text"
                        {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" size={"sm"}>Submit</Button>
              </div>
            </form>
          </Form>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  )
}

export default FolderStructure