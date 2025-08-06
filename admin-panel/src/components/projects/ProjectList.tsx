import axiosInstance from "../../utils/axiosInstance";
import { Link } from 'react-router-dom';
import { Project } from "../../types/Project";

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectList = ({ projects, setProjects }: Props) => {
  if (projects.length === 0) return <p>No projects found.</p>;

  const handleDelete = async (projectId: number) => {
    const confirmDelete = window.confirm("Bu projeyi silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/projects/${projectId}`);
      alert("Proje silindi.");
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız.");
    }
  };

  if (projects.length === 0) return <p>No projects found.</p>;
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Thumbnail</th>
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} className="hover:bg-gray-100">
            <td className="p-2 border">
              <img
                src={project.thumbnail_image}
                alt={project.title}
                className="w-20 h-12 object-cover"
              />
            </td>
            <td className="p-2 border">{project.title}</td>
            <td className="p-2 border space-x-2">
              <Link to={`/admin/projects/edit/${project.id}`} className="text-blue-600 hover:underline">
                Edit
              </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectList;
