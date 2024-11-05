const monthltSubs: SubscriptionPlan[] = [
  {
    title: "Intro",
    featureList: [
      {
        feature: "For personal use",
        excluded: false,
      },
      {
        feature: "Unlimited documents",
        excluded: false,
      },
      {
        feature : "Email support",
        excluded: false,
      },
      {
        feature: "Live collaboration",
        excluded: true,
      },
      {
        feature:
          "Advanced collaboration and user management (team roles, permissions)",
        excluded: true,
      },
      {
        feature: "Subdomain to host your documentation website",
        excluded: true,
      },
      {
        feature: "Custom integrations and onboarding",
        excluded: true,
      },
    ],
    price : 8,
    popular : false,
    planID : "a",
    initialQuantity : "1"
  },
  {
    title: "Base",
    featureList: [
      {
        feature: "Upto 5 users",
        excluded: false,
      },
      {
        feature: "Unlimited documents",
        excluded: false,
      },
      {
        feature : "Email support",
        excluded: false,
      },
      {
        feature: "Live collaboration",
        excluded: false,
      },
      {
        feature:
          "Advanced collaboration and user management (team roles, permissions)",
        excluded: false,
      },
      {
        feature: "Subdomain to host your documentation website",
        excluded: true,
      },
      {
        feature: "Custom integrations and onboarding",
        excluded: true,
      },
    ],
    price : 7.50,
    popular : false,
    planID : "b",
    initialQuantity : "3"
  },
  {
    title: "Pro",
    featureList: [
      {
        feature: "Upto 25 users",
        excluded: false,
      },
      {
        feature: "Unlimited documents",
        excluded: false,
      },
      {
        feature : "Premium email support",
        excluded: false,
      },
      {
        feature: "Live collaboration",
        excluded: false,
      },
      {
        feature:
          "Advanced collaboration and user management (team roles, permissions)",
        excluded: false,
      },
      {
        feature: "Subdomain to host your documentation website",
        excluded: false,
      },
      {
        feature: "Custom integrations and onboarding",
        excluded: true,
      },
      {
        feature: "Feature request",
        excluded: true,
      },
    ],
    price : 7,
    popular : true,
    planID : "c",
    initialQuantity : "10"
  },
  {
    title: "Enterprise",
    featureList: [
      {
        feature: "For 25 users and above",
        excluded: false,
      },
      {
        feature: "Unlimited documents",
        excluded: false,
      },
      {
        feature : "Premium email and call support",
        excluded: false,
      },
      {
        feature: "Live collaboration",
        excluded: false,
      },
      {
        feature:
          "Advanced collaboration and user management (team roles, permissions)",
        excluded: false,
      },
      {
        feature: "Subdomain to host your documentation website",
        excluded: false,
      },
      {
        feature: "Custom integrations and onboarding",
        excluded: false,
      },
      {
        feature: "Custom component and feature request",
        excluded: false,
      },
    ],
    price : "custom",
    popular : false,
    planID : "d",
    initialQuantity : "25"
  },
];

export default monthltSubs;
