import { ArrowRight } from "lucide-react";

export default function ButtonWithHoverArrow() {
  return (
    <div className="relative group flex items-center overflow-hidden">
      <ArrowRight
        size={16}
        className="relative z-10 transition-transform duration-300 transform group-hover:translate-x-6"
      />
      <ArrowRight
        size={16}
        className="absolute top-1/2 left-0 -translate-y-1/2 opacity-0 transition-all duration-300 transform -translate-x-6 group-hover:translate-x-0 group-hover:opacity-100"
      />
    </div>
  );
}
