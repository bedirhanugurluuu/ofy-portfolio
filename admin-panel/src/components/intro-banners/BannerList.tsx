// components/intro-banners/BannerList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface Banner {
  id: number;
  image: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

interface Props {
  banners: Banner[];
  onDelete: (id: number) => void;
}

export default function BannerList({ banners, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <ul className="space-y-4">
      {banners.map((b) => (
        <li
          key={b.id}
          className="p-4 border rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-bold">
              {b.order_index}. {b.title_line1} / {b.title_line2}
            </p>
            <small className="text-gray-600">
              {b.button_text} → {b.button_link}
            </small>
          </div>
          <div className="space-x-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => navigate(`/admin/intro-banners/edit/${b.id}`)}
            >
              Düzenle
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => onDelete(b.id)}
            >
              Sil
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
