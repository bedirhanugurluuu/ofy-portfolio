// pages/intro-banners/index.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerList from "../../components/intro-banners/BannerList";

interface Banner {
  id: number;
  image: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

export default function IntroBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/intro-banners")
      .then((res) => {
        if (!res.ok) throw new Error("Veri alınamadı");
        return res.json();
      })
      .then((data) => {
        setBanners(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/csrf-token", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;

    fetch(`http://localhost:5000/api/intro-banners/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Silme başarısız");
        setBanners(prev => prev.filter(b => b.id !== id));
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Intro Banners</h1>
      {banners.length < 3 ? (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/admin/intro-banners/new")}
        >
          + Yeni Banner
        </button>
      ) : (
        <button
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          title="Maksimum 3 banner eklenebilir"
        >
          Maksimum banner sayısına ulaşıldı
        </button>
      )}
    </div>

    <BannerList banners={banners} onDelete={handleDelete} />
  </div>
);
}
