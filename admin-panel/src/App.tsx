// src/App.tsx
import React, { JSX } from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import axiosInstance, { setCsrfToken } from "./utils/axiosInstance";
import './index.css';

import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

import IntroBannersListPage from "./pages/intro-banners/index";
import IntroBannersNewPage from "./pages/intro-banners/new";
import IntroBannersEditPage from "./pages/intro-banners/edit";

import ProjectsListPage from "./pages/projects/index";
import ProjectsNewPage from "./pages/projects/new";
import ProjectsEditPage from "./pages/projects/edit";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Yükleniyor...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    axiosInstance.get<{ csrfToken: string }>("/api/csrf-token", { withCredentials: true })
      .then(res => {
        setCsrfToken(res.data.csrfToken); // utils/axiosInstance içinde bu fonksiyon token'ı ayarlıyor
      })
      .catch(err => {
        console.error("CSRF token alınırken hata:", err);
      });
  }, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="intro-banners">
              <Route index element={<IntroBannersListPage />} />
              <Route path="new" element={<IntroBannersNewPage />} />
              <Route path="edit/:id" element={<IntroBannersEditPage />} />
            </Route>
            <Route path="projects">
              <Route index element={<ProjectsListPage />} />
              <Route path="new" element={<ProjectsNewPage />} />
              <Route path="edit/:id" element={<ProjectsEditPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
