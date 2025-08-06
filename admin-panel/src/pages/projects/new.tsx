import React from "react";
import ProjectForm from "../../components/projects/ProjectForm";

export default function ProjectsNewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Yeni Proje Ekle</h1>
      <ProjectForm mode="new" />
    </div>
  );
}
