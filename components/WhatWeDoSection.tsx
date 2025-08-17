"use client";
import React from "react";
import { WhatWeDoContent } from "@/lib/api";
import AnimatedText from "./AnimatedText";

interface WhatWeDoSectionProps {
  content: WhatWeDoContent;
}

export default function WhatWeDoSection({ content }: WhatWeDoSectionProps) {
  // Service items'ları parse et
  const service1Items = content.service_1_items.split('\n').filter(item => item.trim());
  const service2Items = content.service_2_items.split('\n').filter(item => item.trim());
  const service3Items = content.service_3_items.split('\n').filter(item => item.trim());

  return (
    <section className="w-full px-5 py-20 bg-white">
      <div className="">
        {/* Header */}
        <div className="mb-25 text-left">
          <h2 className="text-sm font-medium mb-1 uppercase tracking-wider opacity-40">
            {content.title}
          </h2>
          <div className="text-2xl md:text-3xl font-medium max-w-[630px]">
            {content.subtitle}
          </div>
        </div>

        <div className="flex">
            <div className="relative flex-1"></div>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12  flex-2">
                {/* Service 1 */}
                <div className="text-left">
                    <h3 className="text-sm font-medium mb-2 opacity-40">
                        {content.service_1_title}
                    </h3>
                    <ul>
                        {service1Items.map((item, index) => (
                            <li key={index} className="text-sm font-medium">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Service 2 */}
                <div className="text-left">
                    <h3 className="text-sm font-medium mb-2 opacity-40">
                        {content.service_2_title}
                    </h3>
                    <ul>
                        {service2Items.map((item, index) => (
                            <li key={index} className="text-sm font-medium">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Service 3 */}
                <div className="text-left">
                    <h3 className="text-sm font-medium mb-2 opacity-40">
                        {content.service_3_title}
                    </h3>
                    <ul>
                        {service3Items.map((item, index) => (
                            <li key={index} className="text-sm font-medium">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
                 </div>
       </div>
     </section>
   );
 }
