// pages/intro-banners/new.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BannerForm from "../../components/intro-banners/BannerForm";

interface Banner {
  imageFile: File | null;
  order_index: number;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
}

export default function NewIntroBannerPage() {
  const [banner, setBanner] = useState<Banner>({
    imageFile: null,     // Dosya objesi
    order_index: 1,      // Sıra indeksi
    title_line1: "",
    title_line2: "",
    button_text: "",
    button_link: "",
  });

  const [bannersCount, setBannersCount] = useState(0);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/csrf-token", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);

  useEffect(() => {
    if (!csrfToken) return;

    fetch("http://localhost:5000/api/intro-banners", {
      method: "GET",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    })
      .then(res => res.json())
      .then(data => setBannersCount(data.length))
      .catch(() => setBannersCount(0));
  }, [csrfToken]);

  useEffect(() => {
    setBanner(prev => ({ ...prev, order_index: bannersCount + 1 }));
  }, [bannersCount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBanner(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!banner.imageFile) {
      alert("Lütfen bir görsel seçin!");
      return;
    }

    if (banner.order_index === 3) {
      if (
        !banner.title_line1.trim() ||
        !banner.button_text.trim() ||
        !banner.button_link.trim()
      ) {
        alert("Lütfen 3. banner için tüm alanları doldurun!");
        return;
      }
    }

    const formData = new FormData();
    formData.append("image", banner.imageFile);
    formData.append("order_index", String(banner.order_index));

    if (banner.order_index === 3) {
      formData.append("title_line1", banner.title_line1);
      formData.append("title_line2", banner.title_line2);
      formData.append("button_text", banner.button_text);
      formData.append("button_link", banner.button_link);
    }

    fetch("http://localhost:5000/api/intro-banners", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error("Ekleme başarısız");
        return res.json();
      })
      .then(() => {
        alert("Banner başarıyla eklendi");
        navigate("/admin/intro-banners");
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Intro Banner Ekle</h1>
      <BannerForm
        banner={banner}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        submitText="Ekle"
        showFullFields={banner.order_index === 3}
      />
    </div>
  );
}
