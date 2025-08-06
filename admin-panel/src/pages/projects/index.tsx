// pages/projects/index.tsx
"use client";

import { useEffect, useState } from "react";
import ProjectList from "../../components/projects/ProjectList";
import { Link } from 'react-router-dom';
import axios from "../../utils/axiosInstance";
import { Project } from "../../types/Project";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get<Project[]>("/api/projects")
            .then((res) => {
                setProjects(res.data as Project[]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Axios error:", err);
                setProjects([]);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading projects...</p>;

    return (
    <div className="p-4">
        <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link
            to="/admin/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Add New Project
        </Link>
        </div>

        <ProjectList projects={projects} setProjects={setProjects} />
    </div>
    );
}
