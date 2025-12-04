"use client";

import PdfFlipbook from "@/components/ped_pdf/PdfFlipbook";
import Hero from "@/components/ped_pdf/hero/Hero";

export default function CatalogoPdfPage() {
   return (
      <div>
         <Hero />
         <PdfFlipbook />
      </div>
   );
}
