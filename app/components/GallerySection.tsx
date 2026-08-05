import React from 'react';

export default function GallerySection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center" aria-label="Curated Cities Gallery">

      {/* Left Column: Heading text spanning 5 columns */}
      <div className="md:col-span-5 space-y-2 flex flex-col justify-center">
        <span 
          className="text-[6px] font-bold text-neutral-400 uppercase tracking-widest block"
          style={{ fontFamily: 'SFProDisplay, "SF Pro Display", -apple-system, sans-serif' }}
        >
          LAUNCHING SOON
        </span>
        <h2 className="text-[30px] font-canela tracking-tight text-neutral-900 leading-[1.15] max-w-sm">
          We’re curating something special.
        </h2>
      </div>

      {/* Right Column: Image collage spanning 7 columns */}
      <div className="md:col-span-7 w-full flex justify-center md:justify-end">
        <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-neutral-100 shadow-sm bg-neutral-100">
          <img
            src="/images/cities-gallery.jpg"
            alt="Curated cities gallery layout"
            className="w-full h-auto object-cover select-none pointer-events-none"
          />
        </div>
      </div>

    </section>
  );
}