import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductPage from "./ProductPage"
import SubscriptionPage from "./SubscriptionPage"

const AdminPage = () => {
  return (
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
  )
}

export default AdminPage