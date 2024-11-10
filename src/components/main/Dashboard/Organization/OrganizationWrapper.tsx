import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import DashboardSideNav from '../DashboardSideNav'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useUserStore from '@/store/userStore'
import OrgMembers from './OrgMembers'
// import Billing from './Billing'

const OrganizationWrapper = () => {

    const { user } = useUserStore(state => state)

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
                <p className="text-gray-1100 block px-2 py-1 text-xs leading-5 focus:bg-gray-100 focus:text-gray-900 focus:outline-none "> {user?.GithubName}'s Organization</p>
            </div>
            <div className="flex flex-col flex-1">
                <Tabs defaultValue="Members" className="w-full h-full">
                    <TabsList className="w-full flex items-center justify-center rounded-none">
                        <TabsTrigger value="Members">Members</TabsTrigger>
                        {/* <TabsTrigger value="Billing">Billing</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="Members" className="max-h-[calc(100% - 44px)] m-4">
                        <OrgMembers></OrgMembers>
                    </TabsContent>
                    {/* <TabsContent value="Billing" className="max-h-[calc(100% - 44px)] m-4"><Billing/>
                    </TabsContent> */}
                </Tabs>
            </div>
        </main>
    )
}

export default OrganizationWrapper