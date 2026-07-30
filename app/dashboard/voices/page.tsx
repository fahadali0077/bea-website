import React from 'react';

export default function VoicesPage() {
    return (
        <main className="flex-1 flex flex-col gap-6 md:gap-8">
            <title>Top Voices - Ambassador Dashboard</title>
            <section className="bg-[#fbf6f3] rounded-[12px] p-8 md:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.11)] border border-neutral-200/40 relative overflow-hidden flex flex-col justify-between gap-6 min-h-[300px]">
                <div className="space-y-4">
                    <span className="font-sfpro text-[9px] font-bold tracking-[0.05em] text-[#4c3b34] uppercase">
                        Ambassador Program
                    </span>
                    <h1 className="text-[28px] font-canela text-[#332822] tracking-tight leading-tight">
                        Top Voices
                    </h1>
                    <p className="text-[11px] font-lato font-semibold text-neutral-500 max-w-md leading-relaxed">
                        This screen will showcase the top voices and key feedback from the Bea Ambassador community. Stay tuned!
                    </p>
                </div>
            </section>
        </main>
    );
}
