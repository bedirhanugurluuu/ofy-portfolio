"use client";
import React from "react";

interface ClientsIndustriesSectionProps {
  clientsTitle: string;
  clientsList: string;
  industriesTitle: string;
  industriesList: string;
}

export default function ClientsIndustriesSection({
  clientsTitle,
  clientsList,
  industriesTitle,
  industriesList
}: ClientsIndustriesSectionProps) {
  // Parse lists by splitting on newlines and filtering empty lines
  const clients = clientsList.split('\n').filter(client => client.trim());
  const industries = industriesList.split('\n').filter(industry => industry.trim());

  return (
    <section className="w-full py-20">
      <div className="px-5">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Clients */}
          <div className="flex gap-3 border-t pt-5 items-start" style={{ borderColor: '#0000001a' }}>
            <h2 className="text-sm w-1/2 uppercase">{clientsTitle}</h2>
            <div className="grid grid-cols-2 content-center flex-1 gap-x-3">
              {clients.map((client, index) => (
                <div key={index} className="text-sm font-medium opacity-40" style={{ lineHeight: '18px' }}>
                  {client.trim()}
                </div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="flex gap-3 border-t pt-5 items-start" style={{ borderColor: '#0000001a' }}>
            <h2 className="text-sm w-1/2 uppercase">{industriesTitle}</h2>
            <div className="grid grid-cols-2 content-center flex-1 gap-x-3">
              {industries.map((industry, index) => (
                <div key={index} className="text-sm font-medium opacity-40" style={{ lineHeight: '18px' }}>
                  {industry.trim()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
