import ProjectList from "./components/main/Dashboard/Project/Docs/ProjectList";
import FullScreen from "./shared/components/FullScreen"
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import { lazy, Suspense, useEffect, useState } from "react";
import Loader from "./shared/components/Loader";
import MemberTable from "./components/main/DocsPage/Settings/Member/MemberTable";
import MemberDetails from "./components/main/DocsPage/Settings/Member/MemberDetails";
import ProjectCreationDailog from "./components/main/Dashboard/Project/Docs/ProjectCreationDailog";
import Dashboard from "./pages/Dashboard";
import AccountWrapper from "./pages/Account/AccountWrapper";
import { TooltipProvider } from "./components/ui/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { InitializeGoogleAnalytics, TrackPageView } from "./shared/utils/GoogleAnalytics";
import DrawingList from "./components/main/Dashboard/Project/Drawings/DrawingList";
import DrawingsWrapper from "./components/main/Dashboard/Project/Drawings/DrawingsWrapper";
import DrawingsSubList from "./components/main/Dashboard/Project/Drawings/DrawingsSubList";
import Docs from "./public-docs/Docs";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Login = lazy(() => import("./pages/Account/Login"))
const EmailVerify = lazy(() => import("./pages/Account/AddEmail"))
const VerifyOTP = lazy(() => import("./pages/Account/VerifyOTP"))
const DocsWrapper = lazy(() => import("./pages/Docs/DocsWrapper"))
const DocsPage = lazy(() => import("./pages/Docs/DocsPage"))
const ProjectSetting = lazy(() => import("./pages/Docs/ProjectSettings"))
const ProjectWrapper = lazy(() => import('./components/main/Dashboard/Project/ProjectWrapper'))
const Members = lazy(() => import("./components/main/DocsPage/Settings/Member/Members"))
// const Admin = lazy(() => import("./components/main/Dashboard/Admin/AdminPage"))
// const Subscription = lazy(() => import("./pages/Subscription/SubscriptionWrapper"))
// const SubscriptionList = lazy(() => import("./pages/Subscription/SubscriptionList"))
// const SubscriptionPayment = lazy(() => import("./pages/Subscription/SubscriptionPage"))
const OrgWrapper = lazy(() => import("./components/main/Dashboard/Organization/OrganizationWrapper"))
const OrgMembers = lazy(() => import("./components/main/Dashboard/Organization/OrgMembers"))
const Landing = lazy(() => import("./pages/Landing Page/Landing"))
const Drawings = lazy(() => import("./components/main/Drawings/Drawings"))

const App = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  useEffect(() => {
    InitializeGoogleAnalytics()
    TrackPageView()
    const host = window.location.hostname;
    const parts = host.split(".");

    if (parts.length > 2) {
      console.log(parts[0])
      setSubdomain(parts[0]);
    }
  }, [])
  const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <GoogleOAuthProvider clientId={googleClientID}>
      <FullScreen>
        <TooltipProvider>
          <Suspense fallback={<Loader />}>
            {
              subdomain ?
                <Routes>
                  <Route path="/docs" element={<Docs subdomain={subdomain}></Docs>}></Route>
                  <Route path="*" element={<Navigate to="/docs" />} />
                </Routes> :
                <>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/account" element={<AccountWrapper />}>
                      <Route index element={<Navigate to="login" />} />
                      <Route path="login" element={<Login />} />
                      <Route path="verify-email" element={<EmailVerify />} />
                      <Route path="email-otp" element={<VerifyOTP />} />
                      {/* <Route path="subscription" element={<Subscription></Subscription>}>
                <Route index element={<Navigate to="list" />}></Route>
                <Route path="list" element={<SubscriptionList />}></Route>
                <Route path="payment" element={<SubscriptionPayment />}></Route>
              </Route> */}
                    </Route>
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>}>
                      <Route index element={<Navigate to="projects" />}></Route>
                      <Route path="projects" element={<ProjectWrapper></ProjectWrapper>}>
                        <Route index element={<ProjectList></ProjectList>}></Route>
                        <Route path="drawings" element={<ProtectedRoute><DrawingsWrapper></DrawingsWrapper></ProtectedRoute>} >
                          <Route index element={<DrawingList></DrawingList>}></Route>
                          <Route path="sub-list/:projectID" element={<DrawingsSubList></DrawingsSubList>}></Route>
                        </Route>
                        <Route path="new" element={<ProjectCreationDailog></ProjectCreationDailog>}></Route>
                      </Route>
                      <Route path="organization" element={<OrgWrapper />}>
                        <Route index element={<Navigate to={"members"} />}></Route>
                        <Route path="members" element={<OrgMembers />}></Route>
                      </Route>
                      {/* <Route path="admin" element={<Admin />}></Route> */}
                    </Route>
                    <Route path="/project/:folderId" element={<ProtectedRoute><DocsWrapper></DocsWrapper></ProtectedRoute>}>
                      <Route index element={<Navigate to="docs" />}></Route>
                      <Route path="docs" element={<DocsPage></DocsPage>}> </Route>
                      <Route path="settings" element={<ProtectedRoute><ProjectSetting></ProjectSetting></ProtectedRoute>}>
                        <Route index element={<Navigate to="members" />}></Route>
                        <Route path="members" element={<Members></Members>}>
                          <Route index element={<Navigate to="list" />}></Route>
                          <Route path="list" element={<MemberTable></MemberTable>}>
                          </Route>
                          <Route path=":memberName" element={<MemberDetails></MemberDetails>} ></Route>
                        </Route>
                      </Route>
                    </Route>
                    <Route path="/drawings/:folderID" element={<ProtectedRoute><Drawings></Drawings></ProtectedRoute>}></Route>
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </>
            }
          </Suspense>
        </TooltipProvider>
        <Toaster></Toaster>
      </FullScreen>
    </GoogleOAuthProvider>
  )
}

export default App