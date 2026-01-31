import { createHashRouter, Navigate } from "react-router";
import AdminLayout from "./admin/layouts/AdminLayout";
import { ClienteCreatePage } from "./admin/pages/cliente/ClienteCreatePage";
import { ClienteEditPage } from "./admin/pages/cliente/ClienteEditPage";
import { ClienteListaPage } from "./admin/pages/cliente/ClienteListaPage";
import { ClienteViewPage } from "./admin/pages/cliente/ClienteViewPage";
import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { AdminProductPage } from "./admin/pages/product/AdminProductPage";
import { AdminProductsPage } from "./admin/pages/products/AdminProductsPage";
import AuthLayout from "./auth/layouts/AuthLayout";
import { LoginPage } from "./auth/pages/login/LoginPage";
import { RegisterPage } from "./auth/pages/register/RegisterPage";
import { AdminRoute, NotAuthenticatedRoute } from "./components/routes/ProtectedRoutes";

export const appRouter = createHashRouter([
  // Admin como página principal
  {
    path: "/",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "products/:id",
        element: <AdminProductPage />,
      },
      // Rutas de Clientes (Estructura RESTful)
      {
        path: "clientes",
        children: [
          {
            index: true,
            element: <ClienteListaPage />,
          },
          {
            path: "new",
            element: <ClienteCreatePage />,
          },
          {
            path: ":id",
            element: <ClienteViewPage />,
          },
          {
            path: ":id/editar",
            element: <ClienteEditPage />,
          },
        ],
      },
    ],
  },

  // Auth Routes
  {
    path: "/auth",
    element: (
      <NotAuthenticatedRoute>
        <AuthLayout />
      </NotAuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  
  // Redirecciones
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);