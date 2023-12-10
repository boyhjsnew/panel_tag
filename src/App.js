import * as React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Login from "./Page/Login";

import NavBar from "./Components/NavBar";

import "././login.scss";
import "./App.css";
import Dashboard from "./Page/Dashboard";
// import Breadcrumbs from "./Components/Breadcrumbs";

const Layout = () => {
  return (
    <>
      {/* <Breadcrumbs /> */}
      <NavBar />
      <Outlet />
    </>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // {
      //   path: "/customers",
      //   element: <Customer />,
      // },
    ],
  },
]);
function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
