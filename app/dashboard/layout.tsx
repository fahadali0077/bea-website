"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { AuthBootstrap } from '@/app/components/providers/AuthBootstrap';
import { useGetWaitlistDashboardQuery, useLogoutMutation } from '@/features/api/apiSlice';
import { getCompetitionLifecycle } from '@/lib/competition-lifecycle';
import { DayProgress } from '@/app/components/dashboard/DayProgress';
import { Avatar } from '@/app/components/dashboard/Avatar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: dashboard } = useGetWaitlistDashboardQuery();
    const lifecycle = getCompetitionLifecycle(dashboard?.competition);
    const [logout] = useLogoutMutation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = async () => {
        setIsProfileDropdownOpen(false);
        try {
            await logout().unwrap();
        } finally {
            router.replace('/login');
        }
    };

    const profile = {
        name: dashboard?.user.fullName ?? dashboard?.user.email.split('@')[0] ?? 'Member',
        school: dashboard?.school?.name ?? 'Your school',
        // No avatar field on the user yet — the Avatar component renders the
        // initial until one exists. Previously this pointed at a stock image
        // of someone else ('/images/ron-avatar.png') for every single user.
        avatar: null as string | null,
        rank: dashboard?.user.waitlistPosition
            ? `#${dashboard.user.waitlistPosition} on waitlist`
            : '#— on waitlist',
        points: `${dashboard?.referrals.directInvites ?? 0} invites`,
    };
    const isAmbassador = dashboard?.user.role === 'AMBASSADOR';

    useEffect(() => {
        if (!isProfileDropdownOpen) return;

        const handlePointerDown = (e: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsProfileDropdownOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isProfileDropdownOpen]);

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname.startsWith('/dashboard/today');
        }
        if (href === '/dashboard/ambassador') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const navItems = [
        {
            label: 'Today',
            mobileLabel: 'Today',
            href: '/dashboard',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
            ),
        },
        {
            label: 'Top Voices',
            mobileLabel: 'Voices',
            href: '/dashboard/voices',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            ),
        },
        {
            label: 'Forum',
            mobileLabel: 'Forum',
            href: '/dashboard/forum',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 10.321 10.321 0 01-2.169-3.385C2.505 14.167 2 13.11 2 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
            ),
        },
        {
            label: 'Markets',
            mobileLabel: 'Markets',
            href: '/dashboard/markets',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                </svg>
            ),
        },
        {
            label: 'Schools',
            mobileLabel: 'Schools',
            href: '/dashboard/schools',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M12 2.25V4.5m0 0v.096m0-1.846V4.5" />
                </svg>
            ),
        },
        {
            label: 'Leaderboard',
            mobileLabel: 'Rank',
            href: '/dashboard/leaderboard',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125v3.375m9 0M9 18.75V10.5m-4.5 8.25v-3m13.5 3v-6M9 10.5V4.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 4.5v6m-6 0h6" />
                </svg>
            ),
        },
        {
            label: 'Invite Friends',
            mobileLabel: 'Invite',
            href: '/dashboard/invite',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A8.902 8.902 0 0110.25 15c2.146 0 4.142.753 5.71 2.013m-11.96 2.222A8.962 8.962 0 0010.25 21c2.274 0 4.398-.848 6.03-2.26" />
                </svg>
            ),
        },
        {
            label: 'Rewards',
            mobileLabel: 'Rewards',
            href: '/dashboard/rewards',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0-2.625V7.5m-9 0h18m-18 0a1.5 1.5 0 011.5-1.5H5.625M18 7.5a1.5 1.5 0 00-1.5-1.5H12.375m0 9.75h1.125A1.125 1.125 0 0115 16.875v-1.125A1.125 1.125 0 0113.875 14.625H12.75m0 6.75V14.625" />
                </svg>
            ),
        },
        {
            label: 'Shop',
            mobileLabel: 'Shop',
            href: '/dashboard/shop',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            ),
        },
    ];

    const ambassadorNavItems = [
        {
            label: 'Overview',
            mobileLabel: 'Overview',
            href: '/dashboard/ambassador',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h6.75v6.75H3.75V13.5zM13.5 3.75h6.75v16.5H13.5V3.75zM3.75 3.75h6.75v6.75H3.75V3.75z" />
                </svg>
            ),
        },
        {
            label: 'Network',
            mobileLabel: 'Network',
            href: '/dashboard/ambassador/network',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM5.25 21.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM18.75 21.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 7.5v3.75m0 0L5.25 16.5m6.75-5.25l6.75 5.25" />
                </svg>
            ),
        },
        {
            label: 'Ambassador Rank',
            mobileLabel: 'Amb Rank',
            href: '/dashboard/ambassador/leaderboard',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 18.75h10.5M8.25 18.75v-7.5h7.5v7.5M10.5 11.25V5.25h3v6M5.25 21h13.5" />
                </svg>
            ),
        },
        {
            label: 'Calendar',
            mobileLabel: 'Calendar',
            href: '/dashboard/ambassador/calendar',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M4.5 8.25h15M5.25 5.25h13.5A1.5 1.5 0 0120.25 6.75v12A1.5 1.5 0 0118.75 20.25H5.25a1.5 1.5 0 01-1.5-1.5v-12A1.5 1.5 0 015.25 5.25z" />
                </svg>
            ),
        },
        {
            label: 'Rules',
            mobileLabel: 'Rules',
            href: '/dashboard/ambassador/rules',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5h9A1.5 1.5 0 0118 6v12a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 18V6a1.5 1.5 0 011.5-1.5zM8.75 8.25h6.5M8.75 12h6.5M8.75 15.75h4" />
                </svg>
            ),
        },
        {
            label: 'Prizes',
            mobileLabel: 'Prizes',
            href: '/dashboard/ambassador/prizes',
            icon: (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5l2.1 4.25 4.7.68-3.4 3.31.8 4.68L12 15.2l-4.2 2.22.8-4.68-3.4-3.31 4.7-.68L12 4.5z" />
                </svg>
            ),
        },
    ];

    return (
        <AuthBootstrap redirectTo="/auth/login">
        <div className="min-h-screen flex flex-col bg-[#fcfbf8] font-sans pb-8 text-black antialiased">
            {/* Embedded styles to hide scrollbars and define slideIn animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                html {
                    scrollbar-gutter: stable;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />

            {/* HEADER */}
            <header className="w-full bg-[#fcfbf8] z-40 border-b border-neutral-200/40">
                <div className="w-full px-4 sm:px-6 md:px-12 py-4 sm:py-5 flex items-center justify-between gap-2">
                    {/* Logo & Mobile Menu Burger Button */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-1 text-neutral-600 hover:text-neutral-900 focus:outline-none cursor-pointer"
                            aria-label="Open menu"
                        >
                            <svg className="w-6.5 h-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link href="/" className="select-none hover:opacity-80 transition-opacity shrink-0 flex items-center">
                            <img src="/images/assets/Bea_png.png" alt="Bea Logo" className="h-[20px] sm:h-[30px] md:h-[36px] w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Progress Step Dot Indicator */}
                    {!pathname.startsWith('/dashboard/ambassador') && !['/dashboard/forum', '/dashboard/schools', '/dashboard/leaderboard', '/dashboard/invite', '/dashboard/rewards'].includes(pathname) && (
                        <DayProgress
                            dayNumber={lifecycle.dayNumber}
                            totalDays={lifecycle.totalDays}
                            label={lifecycle.label}
                        />
                    )}

                    {/* User Profile dropdown */}
                    <div ref={profileDropdownRef} className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsProfileDropdownOpen((open) => !open)}
                            aria-expanded={isProfileDropdownOpen}
                            aria-haspopup="menu"
                            aria-label={`${profile.name} profile menu`}
                            className="flex items-center gap-1.5 sm:gap-3 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 rounded-full pr-0.5"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-[18px] font-lato font-black text-neutral-800 leading-tight">{profile.name}</p>
                                <p className="text-[14px] font-lato font-medium text-[#7c7b7d] mt-0.5">{profile.school}</p>
                            </div>
                            <Avatar name={profile.name} src={profile.avatar} size={32} className="shadow-sm" />
                            <svg
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {isProfileDropdownOpen && (
                            <div
                                role="menu"
                                aria-label="Profile menu"
                                className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,260px)] sm:w-[280px] bg-[#fcfbf8] border border-neutral-200/60 rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.1)] overflow-hidden"
                            >
                                <div className="px-4 py-4 border-b border-neutral-200/50 bg-[#fbf7f4]">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={profile.name} src={profile.avatar} size={40} className="shadow-sm" />
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-lato font-black text-neutral-800 leading-tight truncate">
                                                {profile.name}
                                            </p>
                                            <p className="text-[12px] font-lato font-medium text-[#7c7b7d] mt-0.5 truncate">
                                                {profile.school}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 text-[11px] font-lato font-semibold">
                                        <span className="text-[#584939]">{profile.rank}</span>
                                        <span className="text-neutral-300">·</span>
                                        <span className="text-neutral-500">{profile.points}</span>
                                    </div>
                                </div>

                          
                                <div className="border-t border-neutral-200/50 py-1.5">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="w-full text-left px-4 py-2.5 text-[13px] font-lato font-semibold text-[#444444] hover:bg-[#faf9f6] hover:text-neutral-950 transition-colors cursor-pointer"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => void handleSignOut()}
                                        className="w-full text-left block px-4 py-2.5 text-[13px] font-lato font-semibold text-[#b0453a] hover:bg-[#faf0eb] transition-colors cursor-pointer"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* DASHBOARD CONTENT CONTAINER */}
            <div className="flex-grow w-full px-6 md:px-12 flex flex-col md:flex-row gap-8 py-8">

                {/* SIDEBAR (DESKTOP) */}
                <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0 justify-between min-h-[calc(100vh-160px)] border-r border-neutral-300/40 pr-6">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <React.Fragment key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`w-full text-left py-3 px-4 rounded-[8px] flex items-center gap-3.5 font-lato text-[14px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer subpixel-antialiased ${active
                                            ? 'bg-[#f1eee7] text-black shadow-sm'
                                            : 'text-[#444444] hover:text-neutral-950 hover:bg-[#f1eee7]/50'
                                            }`}
                                    >
                                        <div className="w-4.5 h-4.5 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full">
                                            {item.icon}
                                        </div>
                                        <span>{item.label}</span>
                                    </Link>
                                </React.Fragment>
                            );
                        })}
                        {isAmbassador && (
                            <div className="mt-5 border-t border-neutral-200/70 pt-4">
                                <p className="px-4 pb-2 font-lato text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400">
                                    Ambassador
                                </p>
                                <div className="flex flex-col gap-1">
                                    {ambassadorNavItems.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className={`w-full text-left py-3 px-4 rounded-[8px] flex items-center gap-3.5 font-lato text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer subpixel-antialiased ${active
                                                    ? 'bg-[#f1eee7] text-black shadow-sm'
                                                    : 'text-[#444444] hover:text-neutral-950 hover:bg-[#f1eee7]/50'
                                                    }`}
                                            >
                                                <div className="w-4.5 h-4.5 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full">
                                                    {item.icon}
                                                </div>
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                </aside>

                {/* MAIN DASHBOARD CONTENT AREA */}
                {children}

            </div>

            {/* MOBILE DRAWER MENUBAR */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-[1px] transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Drawer Panel */}
                    <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-[#fcfbf8] shadow-2xl flex flex-col p-5 transition-transform duration-300 animate-slide-in">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-5 border-b border-neutral-200/50">
                            <img src="/images/assets/Bea_png.png" alt="Bea Logo" className="h-[24px] w-auto object-contain" />
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 text-neutral-500 hover:text-neutral-800 focus:outline-none cursor-pointer"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-grow flex flex-col gap-0.5 overflow-y-auto no-scrollbar py-5">
                            {navItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <React.Fragment key={item.label}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`w-full text-left py-2 px-3 rounded-[8px] flex items-center gap-2.5 font-lato text-[13px] font-semibold transition-all duration-200 cursor-pointer ${active
                                                ? 'bg-[#f1eee7] text-black shadow-sm'
                                                : 'text-[#444444] hover:text-neutral-950 hover:bg-[#f1eee7]/50'
                                                }`}
                                        >
                                            <div className="w-4 h-4 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full">
                                                {item.icon}
                                            </div>
                                            <span>{item.label}</span>
                                        </Link>
                                    </React.Fragment>
                                );
                            })}
                            {isAmbassador && (
                                <div className="mt-4 border-t border-neutral-200/70 pt-4">
                                    <p className="px-3 pb-2 font-lato text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                                        Ambassador
                                    </p>
                                    <div className="flex flex-col gap-0.5">
                                        {ambassadorNavItems.map((item) => {
                                            const active = isActive(item.href);
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`w-full text-left py-2 px-3 rounded-[8px] flex items-center gap-2.5 font-lato text-[13px] font-semibold transition-all duration-200 cursor-pointer ${active
                                                        ? 'bg-[#f1eee7] text-black shadow-sm'
                                                        : 'text-[#444444] hover:text-neutral-950 hover:bg-[#f1eee7]/50'
                                                        }`}
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full">
                                                        {item.icon}
                                                    </div>
                                                    <span>{item.mobileLabel}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AuthBootstrap>
    );
}
