import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Company from "./pages/Company";
import Employee from "./pages/Employee";
import Apply from "./pages/Apply";
import Lookup from "./pages/Lookup";
import Success from "./pages/Success";
import FAQ from "./pages/FAQ";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "company", Component: Company },
      { path: "employee", Component: Employee },
      { path: "apply", Component: Apply },
      { path: "lookup", Component: Lookup },
      { path: "success", Component: Success },
      { path: "faq", Component: FAQ },
    ],
  },
]);
