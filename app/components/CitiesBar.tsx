"use client";

import React, { useState } from 'react';

export default function CitiesBar() {
    const [selectedCity, setSelectedCity] = useState("NYC");

    const cities = [
        "NYC", "Boston", "Miami", "Los Angeles", "Chicago",
        "Austin", "Phoenix", "Atlanta", "Charlotte", "Denver", "Columbus", "DC"
    ];

    return (
        <section className="w-full max-w-5xl mx-auto px-6 py-6">
            {/* Small label above the row */}
            <span className="text-[7px] font-sans font-bold text-gray-400 uppercase tracking-widest block mb-4">
                Launching first in
            </span>

            {/* Horizontal scrolling wrapper: allowing thumb-swiping on mobile smoothly */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-3 scrollbar-hide no-scrollbar snap-x scroll-smooth">
                {cities.map((city, index) => {
                    const isActive = selectedCity === city;

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedCity(city)}
                            className={`px-3.5 py-1.5 rounded-full text-[6px] font-sans font-bold tracking-widest whitespace-nowrap transition-all duration-300 snap-center cursor-pointer hover:scale-105 active:scale-95
                ${isActive
                                    ? 'bg-[#050505] text-white shadow-md'
                                    : 'bg-[var(--bea-pill-light)] text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                                }`}
                        >
                            {city}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
