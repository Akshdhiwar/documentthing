import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductPage from "./ProductPage"
import SubscriptionPage from "./SubscriptionPage"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import DashboardSideNav from "../DashboardSideNav"

const AdminPage = () => {
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-b border-default bg-white sticky top-0 z-10">
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} className="p-1" variant={"ghost"}><Menu height={18} width={18}></Menu></Button>
            </SheetTrigger>
            <SheetContent className="p-0 w-min" side={"left"}>
              <DashboardSideNav />
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-gray-1100 block px-2 py-1 text-xs leading-5 focus:bg-gray-100 focus:text-gray-900 focus:outline-none ">Super Admin</p>
      </div>
      <div className="flex flex-col flex-1">
        <Tabs defaultValue="Product" className="w-full h-full">
          <TabsList className="w-full flex items-center justify-center rounded-none">
            <TabsTrigger value="Product">Product</TabsTrigger>
            <TabsTrigger value="Subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="Product" className="max-h-[calc(100% - 44px)] m-4">
            <ProductPage />
          </TabsContent>
          <TabsContent value="Subscriptions" className="max-h-[calc(100% - 44px)] m-4">
            <SubscriptionPage></SubscriptionPage>
          </TabsContent>
        </Tabs>
      </div>
    </main>

  )
}

export default AdminPage