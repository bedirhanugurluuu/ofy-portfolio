"use client";
import React from "react";
import { Award } from "@/lib/api";

interface AwardsSectionProps {
  awards: Award[];
}

export default function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section className="w-full py-20">
      <div className="px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Sol taraf - Awards başlığı */}
          <div className="flex flex-col">
            <div className="border-t border-gray-300 pt-2">
              <h2 className="text-sm font-medium uppercase opacity-40">
                Awards
              </h2>
            </div>
          </div>

          {/* Sağ taraf - Awards listesi */}
          <div className="flex flex-col ">
            {awards.map((award) => (
              <a
                key={award.id}
                href={award.description || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden border-t border-gray-300 pt-2 pb-2 min-w-[200px] transition-all duration-500 ease-in-out"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>

                                 {/* Content */}
                 <div className="relative z-10 flex space-y-2">
                   <h3 className="text-sm font-medium mb-0 group-hover:text-white transition-colors duration-500 w-1/2">
                     {award.title}
                   </h3>
                   <p className="text-sm font-medium mb-0 group-hover:text-white transition-colors duration-500 w-1/4">
                     {award.description}
                   </p>
                   <p className="text-sm font-medium mb-0 group-hover:text-white transition-colors duration-500 w-1/4 flex justify-end">
                     {award.year}
                   </p>
                 </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
