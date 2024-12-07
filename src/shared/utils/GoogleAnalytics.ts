import ReactGA from "react-ga4";

function InitializeGoogleAnalytics() {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID, {
    testMode: import.meta.env.VITE_ENVIRONMENT === "Local" ? true : false,
  });
}

function TrackPageView(userName?: string, userID?: string) {
  // Send pageview with a custom path
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
    title: userName + " " + userID,
  });
}

function TrackEvent(category: string, actionName: string, label: string) {
  ReactGA.event({
    category: category,
    action: actionName,
    label: label,
  });
}

export { InitializeGoogleAnalytics, TrackPageView, TrackEvent };
