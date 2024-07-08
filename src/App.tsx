import ProjectList from "./components/main/Dashboard/ProjectList";
import FullScreen from "./components/main/FullScreen"
import ProjectDasboard from "./components/main/ProjectDasboard";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <FullScreen>
      <Routes>
        <Route path="/" Component={ProjectDasboard}>
          <Route index element={<Navigate to="dashboard" />}></Route>
          <Route path="dashboard" element={<ProjectList />}></Route>
        </Route>
      </Routes>
    </FullScreen>
  )
}

export default App