import ProjectList from "./components/main/Dashboard/ProjectList";
import FullScreen from "./shared/components/FullScreen"
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import Loader from "./shared/components/Loader";
// import DocsPage from "./pages/DocsPage";

const Login = lazy(() => import("./pages/Login"))
const DocsPage = lazy(() => import("./pages/DocsPage"))
const ProjectDasboard = lazy(() => import('./components/main/Dashboard/ProjectDasboard'))

const App = () => {
  return (
    <FullScreen>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Navigate to="login" />}></Route>
          <Route index path="/login" Component={Login}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><ProjectDasboard></ProjectDasboard></ProtectedRoute>}>
            <Route index element={<Navigate to="projects" />}></Route>
            <Route path="projects" element={<ProjectList />}></Route>
          </Route>
          <Route path="/project/:folderId" element={<ProtectedRoute><DocsPage></DocsPage></ProtectedRoute>}>
          </Route>
        </Routes>
      </Suspense>
      <Toaster></Toaster>
    </FullScreen>
  )
}

export default App