// src/layouts/MainLayout.tsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MainLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Intro Banners", path: "/admin/intro-banners" },
    { name: "Projects", path: "/admin/projects" }
    // Yeni menüler ekleyebilirsin
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 md:hidden">
          <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-900 hover:text-gray-700 transition"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8 px-6 md:px-8">
          <h2 className="hidden md:block text-3xl font-bold text-gray-900 mb-10">Admin Panel</h2>

          <ul className="space-y-2">
            {menuItems.map(({ name, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-gray-700 font-semibold rounded-lg px-4 py-3
                     transition-colors duration-300
                     ${isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-blue-100 hover:text-blue-700"}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* İkon eklemek istersen buraya koyabilirsin */}
                  <span className="text-lg">{name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="mt-12 w-full text-left px-4 py-3 font-semibold rounded-lg text-red-600 hover:bg-red-100 transition"
          >
            Çıkış Yap
          </button>
        </nav>
      </aside>

      {/* Overlay mobilde */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <button
            className="text-gray-900 md:hidden text-2xl"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <div></div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
