import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signin from "./pages/Auth/Signup";
import Dashboard from "./pages/Admin/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUser from "./pages/Admin/ManageUser";
import TeamMember from "./pages/Admin/TeamMember";
import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import Viewtaskdetail from "./pages/User/Viewtaskdetail";
import UserProvider, { UserContext } from "./context/UserContext"; // import UserContext here


const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signin />} />

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/tasks" element={<ManageUser />} />
            <Route path="/admin/team-member" element={<TeamMember />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/taskdetais" element={<Viewtaskdetail />} />
          </Route>

          {/* Root Redirect Based on Role */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    
      
    </UserProvider>
  );
};

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};

export default App;
