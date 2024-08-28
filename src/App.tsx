import ProjectList from "./components/main/Dashboard/ProjectList";
import FullScreen from "./shared/components/FullScreen"
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import Loader from "./shared/components/Loader";
import Members from "./components/main/DocsPage/Settings/Member/Members";
import MemberTable from "./components/main/DocsPage/Settings/Member/MemberTable";
// import DocsPage from "./pages/DocsPage";

const Login = lazy(() => import("./pages/Login"))
const DocsWrapper = lazy(() => import("./pages/Docs/DocsWrapper"))
const DocsPage = lazy(() => import("./pages/Docs/DocsPage"))
const ProjectSetting = lazy(() => import("./pages/Docs/ProjectSettings"))
const ProjectDasboard = lazy(() => import('./components/main/Dashboard/ProjectDasboard'))

const App = () => {
  return (
    <FullScreen>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="login" />}></Route>
          <Route index path="/login" Component={Login}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><ProjectDasboard></ProjectDasboard></ProtectedRoute>}>
            <Route index element={<Navigate to="projects" />}></Route>
            <Route path="projects" element={<ProjectList />}></Route>
          </Route>
          <Route path="/project/:folderId" element={<ProtectedRoute><DocsWrapper></DocsWrapper></ProtectedRoute>}>
            <Route index element={<Navigate to="docs" />}></Route>
            <Route path="docs" element={<DocsPage></DocsPage>}> </Route>
            <Route path="settings" element={<ProtectedRoute><ProjectSetting></ProjectSetting></ProtectedRoute>}>
              <Route index element={<Navigate to="members" />}></Route>
              <Route path="members" element={<Members></Members>}>
                  <Route index element={<Navigate to="list" />}></Route>
                  <Route path="list" element={<MemberTable></MemberTable>}></Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster></Toaster>
    </FullScreen>
  )
}

export default App