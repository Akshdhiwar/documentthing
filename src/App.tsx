import ProjectList from "./components/main/Dashboard/ProjectList";
import FullScreen from "./components/main/FullScreen"
import ProjectDasboard from "./components/main/ProjectDasboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import DocsPage from "./components/pages/DocsPage";
import UserProvider from "./provider/UserProvider";
import Login from "./components/pages/Login";
import ProtectedRoute from "./components/main/ProtectedRoute";

const App = () => {
  return (
    <UserProvider>
      <FullScreen>
        <Routes>
          <Route path="/login" Component={Login}></Route>
          <Route path="/" element={<ProtectedRoute><ProjectDasboard></ProjectDasboard></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" />}></Route>
            <Route path="dashboard" element={<ProjectList />}></Route>
          </Route>
          <Route path="/project/:folderId" element={<ProtectedRoute><DocsPage></DocsPage></ProtectedRoute>}>
          </Route>
        </Routes>
        <Toaster></Toaster>
      </FullScreen>
    </UserProvider>
  )
}

export default App