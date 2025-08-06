import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  client_name: string;
  year: string;
  role: string;
  thumbnail_image: string;
  video_url?: string | null;
  featured_order: number;
  gallery_images?: string[]; // yeni alan
}

const ProjectsEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get<Project>(`/api/projects/${id}`);
        setProject(res.data);
        setTitle(res.data.title);
        setSubtitle(res.data.subtitle);
        setDescription(res.data.description || "");
        setClientName(res.data.client_name || "");
        setYear(res.data.year || "");
        setRole(res.data.role || "");
        setGallery(res.data.gallery_images || []);
      } catch (err: any) {
        console.error("Proje getirme hatası:", err.response?.status, err.message);
        setError("Proje bulunamadı");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/projects/${id}`, {
        title,
        subtitle,
        description,
        client_name: clientName,
        year,
        role,
        slug: project?.slug,
        thumbnail_image: project?.thumbnail_image,
        video_url: project?.video_url,
        featured_order: project?.featured_order,
      });

      alert("Proje başarıyla güncellendi.");
      navigate("/admin/projects");
    } catch (err) {
      alert("Güncelleme sırasında hata oluştu.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleGalleryUpload = async () => {
    if (!newImages.length) {
      alert("Yüklenecek görsel seçilmedi.");
      return;
    }

    const formData = new FormData();
    newImages.forEach((file) => formData.append("images", file));

    try {
      await axiosInstance.post(`/api/projects/${id}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Galeri başarıyla yüklendi.");
      setNewImages([]);
      // Galeriyi yeniden yükle
      const res = await axiosInstance.get<Project>(`/api/projects/${id}`);
      setGallery(res.data.gallery_images || []);
    } catch (err) {
      console.error(err);
      alert("Galeri yüklenirken hata oluştu.");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Proje bulunamadı.</div>;

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginBottom: "0.25rem",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#2563eb", // Tailwind blue-600
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "1rem" }}>Projeyi Düzenle</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>Başlık:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Alt Başlık:</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Açıklama:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Müşteri (Client):</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Yıl:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Rol:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>Güncelle</button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h2 style={{ fontSize: "20px", marginBottom: "0.5rem" }}>Galeri Görselleri</h2>

      <input type="file" multiple onChange={handleFileChange} style={{ marginBottom: "1rem" }} />
      <button onClick={handleGalleryUpload} style={buttonStyle}>Galeri Yükle</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
        {gallery.map((img, idx) => (
          <img
            key={idx}
            src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
            alt={`galeri-${idx}`}
            style={{ width: "100%", borderRadius: "8px", objectFit: "cover", height: "150px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsEditPage;
