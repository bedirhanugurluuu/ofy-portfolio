import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface ProjectFormProps {
  mode: "new" | "edit";
}

const ProjectForm: React.FC<ProjectFormProps> = ({ mode }) => {
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null); // Yeni banner state
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");

  // CSRF Token alma
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/csrf-token", {
        withCredentials: true,
      })
      .then((res: AxiosResponse<{ csrfToken: string }>) => {
        setCsrfToken(res.data.csrfToken);
      })
      .catch((err) => console.error("CSRF token alınamadı:", err));
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailImage(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBannerImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", title);
    data.append("subtitle", subtitle);
    data.append("slug", slug);
    data.append("description", description);
    data.append("client_name", clientName);
    data.append("year", year);
    data.append("role", role);
    if (thumbnailImage) {
      data.append("thumbnail_image", thumbnailImage);
    }
    if (bannerImage) {
      data.append("banner_image", bannerImage);
    }
    data.append("is_featured", isFeatured ? "1" : "0");
    if (featuredOrder !== null) {
      data.append("featured_order", featuredOrder.toString());
    }

    try {
      const res = await axios.post<{ message: string; projectId: number }>(
        "http://localhost:5000/api/projects",
        data,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            //"Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      alert("Proje eklendi, ID: " + res.data.projectId);

      // Formu sıfırla
      setTitle("");
      setSubtitle("");
      setSlug("");
      setDescription("");
      setClientName("");
      setYear("");
      setRole("");
      setThumbnailImage(null);
      setBannerImage(null);
      setIsFeatured(false);
      setFeaturedOrder(null);
    } catch (err) {
      console.error("Proje ekleme hatası:", err);
      alert("Proje eklenemedi!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
      <input
        type="text"
        name="title"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        name="subtitle"
        placeholder="Alt başlık"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <input
        type="text"
        name="slug"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        className="resize-y"
      />
      <input
        type="text"
        name="client_name"
        placeholder="Client"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      <input
        type="number"
        name="year"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <input
        type="text"
        name="role"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <label>
        Thumbnail Resim:
        <input
          type="file"
          name="thumbnail_image"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </label>
      <label>
        Banner Resim:
        <input
          type="file"
          name="banner_image"
          accept="image/*"
          onChange={handleBannerChange}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
        Featured mı?
      </label>
      <input
        type="number"
        name="featured_order"
        placeholder="Featured sırası"
        value={featuredOrder || ""}
        onChange={(e) => setFeaturedOrder(Number(e.target.value))}
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded">
        Proje Ekle
      </button>
    </form>
  );
};

export default ProjectForm;
