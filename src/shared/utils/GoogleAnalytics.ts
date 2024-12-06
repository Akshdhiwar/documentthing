import ReactGA from "react-ga4";

function InitializeGoogleAnalytics() {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID);
}

function TrackPageView() {
  console.log(window.location.pathname + window.location.search)
  // Send pageview with a custom path
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
}

function TrackEvent() {
  ReactGA.event({
    category: "User Actions",
    action: "Clicked Button",
    label: "Button Clicked",
  });
}

export { InitializeGoogleAnalytics, TrackPageView, TrackEvent };
