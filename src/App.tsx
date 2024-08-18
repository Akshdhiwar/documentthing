import ProjectList from "./components/main/Dashboard/ProjectList";
import FullScreen from "./shared/components/FullScreen"
import ProjectDasboard from "./components/main/ProjectDasboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import DocsPage from "./pages/DocsPage";
import Login from "./pages/Login";
import ProtectedRoute from "./shared/components/ProtectedRoute";

const App = () => {
  return (
    <FullScreen>
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
      <Toaster></Toaster>
    </FullScreen>
  )
}

export default App