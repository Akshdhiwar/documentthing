import monthltSubs from "./Subscription"
import SubscriptionCard from "./SubscriptionCard"

const SubscriptionList = () => {
  return (
    <div className="w-full h-full bg-slate-200 flex items-center justify-evenly flex-col overflow-y-auto">
      <div className="text-center py-10">
        <p className="text-2xl font-bold">The Right Plan for Your Business</p>
        <p>We have several powerful plans to showcase your business and get discovered as a creative entrepreneurs. Everything you need.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-2 m-4 rounded-xl shadow-lg">
        {
          monthltSubs.map((plan, index) => {
            return <div className="max-w-xs mx-auto w-full h-full" key={index}>
              <SubscriptionCard details={plan} paymentPage={false} />
            </div>
          })
        }
      </div>
      <div></div>
    </div>
  )
}

export default SubscriptionList