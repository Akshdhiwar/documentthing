import { useLocation, useNavigate } from "react-router-dom";
import SubscriptionCard from "./SubscriptionCard";
import monthltSubs from "./Subscription";
import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import useUserStore from "@/store/userStore";
import { PayPalButtons } from "@paypal/react-paypal-js";

const SubscriptionPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { planID } = location.state || {};
  const details = monthltSubs.find((plan) => plan.planID === planID);
  const axiosInstance = useAxiosWithToast();
  const { org, user } = useUserStore(state => state)
  if (!details) return

  return (
    <div className="m-4 flex border rounded-lg">
      <div className="border-r bg-slate-200 p-4 rounded-tl-lg rounded-bl-lg">
        <SubscriptionCard details={details} paymentPage={true}></SubscriptionCard>
      </div>
      <div className="p-4 flex flex-col justify-between w-96">
        <div className="flex items-center justify-between gap-2">
          <div>Subscription Plan</div>
          <div>${details.price}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Tax</div>
          <div>*applicable</div>
        </div>
        <div className="h-48"></div>
        <div className="flex items-center justify-between gap-2">
          <div>Total</div>
          <div>${details.price} + taxes</div>
        </div>
        <PayPalButtons
          createSubscription={(data: any, actions: any) => {
            console.log(data)
            // Check if actions.subscription.create exists before calling it
            if (!actions || !actions.subscription || !actions.subscription.create) {
              console.error("Subscription creation method is unavailable.");
              return Promise.reject("Subscription creation is unavailable.");
            }

            return actions.subscription
              .create({
                plan_id: "P-7D954345UG455031YM4UQYNY",
                custom_id: user?.Email,
                subscriber: {
                  email_address: user?.Email, // Replace with your actual plan ID
                },
                quantity: details.initialQuantity
              })
              .then((subscriptionId: string) => {

                axiosInstance.post("/subscription", {
                  sub_id: subscriptionId,
                  org_id: org?.id
                })

                // Your code here after successfully creating the subscription
                console.log("Subscription created with ID:", subscriptionId);
                return subscriptionId;
              })
              .catch((error: any) => {
                console.error("Error creating subscription:", error);
              });
          }}
          style={{
            label: "subscribe",
          }}
          onApprove={() => {
            return new Promise<void>((resolve) => {
              navigate("/dashboard/projects");
              resolve();
            });
          }}
        />
      </div>

    </div>
  );

}

export default SubscriptionPage