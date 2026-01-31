import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router";

import { ShopLayout } from "./shop/layouts/ShopLayout";
import { HomePage } from "./shop/pages/home/HomePage";
import { ProductPage } from "./shop/pages/product/ProductPage";
import { GenderPage } from "./shop/pages/gender/GenderPage";

import { LoginPage } from "./auth/pages/login/LoginPage";
import { RegisterPage } from "./auth/pages/register/RegisterPage";

import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { AdminProductPage } from "./admin/pages/product/AdminProductPage";
import { AdminProductsPage } from "./admin/pages/products/AdminProductsPage";

import {
  AdminRoute,
  NotAuthenticatedRoute,
} from "./components/routes/ProtectedRoutes";
import { ClienteListaPage } from "./admin/pages/cliente/ClienteListaPage";
import { ClienteEditPage } from "./admin/pages/cliente/ClienteEditPage";
import { ClienteViewPage } from "./admin/pages/cliente/ClienteViewPage";
import { ClienteCreatePage } from "./admin/pages/cliente/ClienteCreatePage";

const AuthLayout = lazy(() => import("./auth/layouts/AuthLayout"));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));

export const appRouter = createHashRouter([
  // export const appRouter = createBrowserRouter([
  // Main routes
  {
    path: "/",
    element: <ShopLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "product/:idSlug",
        element: <ProductPage />,
      },
      {
        path: "gender/:gender",
        element: <GenderPage />,
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
  // Admin Routes
  {
    path: "/admin",
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
            element: <ClienteListaPage />, // Listado
          },
          {
            path: "new",
            element: <ClienteCreatePage />, // Crear
          },
          {
            path: ":id",
            element: <ClienteViewPage />, // Ver
          },
          {
            path: ":id/editar",
            element: <ClienteEditPage />, // Editar
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
