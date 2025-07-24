import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import logoPng from '../assets/logo_Png.png';
import { FaInstagram, FaFacebookF, FaTwitter, FaRocket } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

const socialLinks = [
    { href: "https://instagram.com/wibe_ex", icon: <FaInstagram />, label: "Instagram" },
    { href: "https://x.com/wibe_ex", icon: <FaTwitter />, label: "X" },
    { href: "https://www.facebook.com/people/WibeeX/61578853760526/", icon: <FaFacebookF />, label: "Facebook" },
];

const targetDate = new Date("2025-10-10T00:00:00").getTime();

const LandingPage = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const logo3DRef = useRef();
    const blob1Ref = useRef();
    const blob2Ref = useRef();
    const blob3Ref = useRef();
    const blob4Ref = useRef();

    // Optimized countdown timer
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    // Optimized blob animations using CSS transforms
    useEffect(() => {
        const animateBlobs = () => {
            if (!blob1Ref.current || !blob2Ref.current || !blob3Ref.current) return;
            try {
                const t = Date.now() / 2000;
                const w = window.innerWidth;
                const h = window.innerHeight;
                // Blob 1: moves from top to mid
                blob1Ref.current.style.transform =
                    `translate3d(${w * 0.5 + Math.cos(t) * w * 0.25 - 120}px, ${h * 0.2 + Math.sin(t / 1.2) * h * 0.15 - 150}px, 0)`;
                // Blob 2: moves from mid to bottom
                blob2Ref.current.style.transform =
                    `translate3d(${w * 0.5 + Math.cos(t + Math.PI) * w * 0.22 - 120}px, ${h * 0.5 + Math.sin(t / 1.5 + Math.PI) * h * 0.18 - 120}px, 0)`;
                // Blob 3: moves from bottom to mid
                blob3Ref.current.style.transform =
                    `translate3d(${w * 0.5 + Math.cos(t / 1.3 + 1) * w * 0.18 - 80}px, ${h * 0.8 + Math.sin(t / 1.7 + 2) * h * 0.12 - 80}px, 0)`;
                // Blob 4: moves from bottom to mid
                blob4Ref.current.style.transform =
                    `translate3d(${w * 0.5 + Math.cos(t / 1.3 + 1) * w * 0.18 - 80}px, ${h * 0.8 + Math.sin(t / 1.7 + 2) * h * 0.12 - 80}px, 0)`;
            } catch (error) {
                console.error('Animation error:', error);
            }
        };

        let animationId = requestAnimationFrame(function animate() {
            animateBlobs();
            animationId = requestAnimationFrame(animate);
        });

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    // Optimized mouse move handler with throttling
    useEffect(() => {
        let ticking = false;

        const handleMouseMove = (e) => {
            if (!ticking && logo3DRef.current) {
                requestAnimationFrame(() => {
                    const rect = logo3DRef.current.getBoundingClientRect();
                    const logoX = rect.left + rect.width / 2;
                    const logoY = rect.top + rect.height / 2;
                    const dx = e.clientX - logoX;
                    const dy = e.clientY - logoY;
                    const maxTilt = 20; // Reduced tilt for better performance
                    const rotateY = Math.max(-maxTilt, Math.min(maxTilt, dx / 12));
                    const rotateX = Math.max(-maxTilt, Math.min(maxTilt, -dy / 12));
                    logo3DRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Touch event handler for mobile
        const handleTouchMove = (e) => {
            if (!ticking && logo3DRef.current && e.touches && e.touches.length === 1) {
                requestAnimationFrame(() => {
                    const touch = e.touches[0];
                    const rect = logo3DRef.current.getBoundingClientRect();
                    const logoX = rect.left + rect.width / 2;
                    const logoY = rect.top + rect.height / 2;
                    const dx = touch.clientX - logoX;
                    const dy = touch.clientY - logoY;
                    const maxTilt = 20;
                    const rotateY = Math.max(-maxTilt, Math.min(maxTilt, dx / 12));
                    const rotateX = Math.max(-maxTilt, Math.min(maxTilt, -dy / 12));
                    logo3DRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    // Handle image load
    const handleImageLoad = useCallback(() => {
        console.log('Logo loaded successfully');
        setIsLoaded(true);
    }, []);

    const handleImageError = useCallback((error) => {
        console.error('Logo failed to load:', error);
        setIsLoaded(true); // Still show the component
    }, []);

    // Memoize countdown display with perfect mobile layout
    const countdownDisplay = useMemo(() => (
        <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 text-white font-bold mb-6 sm:mb-8 max-w-xs sm:max-w-sm mx-auto">
            <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-none">{timeLeft.days}</span>
                <span className="text-xs sm:text-sm font-normal mt-1 text-white/70">Days</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-xs sm:text-sm font-normal mt-1 text-white/70">Hours</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-xs sm:text-sm font-normal mt-1 text-white/70">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-xs sm:text-sm font-normal mt-1 text-white/70">Seconds</span>
            </div>
        </div>
    ), [timeLeft]);

    return (
        <div className="relative h-screen bg-gradient-to-br from-[#0a1a2f] via-[#0a1a2f] to-[#0e223a] flex flex-col justify-between overflow-hidden border-0 outline-none">
            {/* Top Bar */}
            <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
                <div className="flex items-center gap-2">
                    <span className="text-white font-bold tracking-widest text-base sm:text-lg">WIBEE<span className="text-[#e552ff]">X</span></span>
                </div>
            </header>

            {/* Optimized Animated Blobs */}
            {/* Blob 1: Magenta */}
            <div
                ref={blob1Ref}
                className="absolute rounded-full blur-3xl pointer-events-none w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] opacity-40"
                style={{
                    background: 'radial-gradient(circle at 60% 40%, #e552ff 60%, transparent 100%)',
                    zIndex: 0,
                    willChange: 'transform',
                }}
                aria-hidden="true"
            />
            {/* Blob 2: Aqua */}
            <div
                ref={blob2Ref}
                className="absolute rounded-full blur-3xl pointer-events-none w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] opacity-30"
                style={{
                    background: 'radial-gradient(circle at 40% 60%, #52ffc9 60%, transparent 100%)',
                    zIndex: 0,
                    willChange: 'transform',
                }}
                aria-hidden="true"
            />
            {/* Blob 3: Magenta */}
            <div
                ref={blob3Ref}
                className="absolute rounded-full blur-3xl pointer-events-none w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] opacity-20"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #e552ff 60%, transparent 100%)',
                    zIndex: 0,
                    willChange: 'transform',
                }}
                aria-hidden="true"
            />
            {/* Blob 4: Aqua */}
            <div
                ref={blob4Ref}
                className="absolute rounded-full blur-3xl pointer-events-none w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] opacity-30"
                style={{
                    background: 'radial-gradient(circle at 40% 60%, #52ffc9 60%, transparent 100%)',
                    zIndex: 0,
                    willChange: 'transform',
                }}
                aria-hidden="true"
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center items-center relative z-10 px-3 sm:px-4 md:px-6">
                <div className="max-w-xl w-full text-center mt-6 sm:mt-8 md:mt-16">
                    {/* Centered logo above heading */}
                    <img
                        ref={logo3DRef}
                        src={logoPng}
                        alt="WibeEx Logo"
                        className={`w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain mx-auto mb-3 sm:mb-4 md:mb-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="eager"
                    />
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2 leading-tight">Simple. Secure. Smart.</h1>
                    <p className="text-white/80 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg px-2 leading-relaxed">The new age of digital trading is coming.</p>

                    {/* Expected launch date - styled prominently */}
                    <p className="mb-4 sm:mb-6 text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2">
                        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl align-middle" role="img" aria-label="rocket">🚀</span>
                        <span className="bg-gradient-to-r from-[#e552ff] to-[#52ffc9] text-transparent bg-clip-text">
                            Expected launch on <span className="underline underline-offset-2">October 10 2025</span>.
                        </span>
                    </p>

                    {/* Countdown */}
                    {countdownDisplay}
                </div>
            </main>

            {/* Social Icons Bottom Left */}
            <footer className="absolute left-4 sm:left-6 md:left-8 bottom-4 sm:bottom-6 flex gap-3 sm:gap-4 z-20">
                {socialLinks.map(({ href, icon, label }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${label}`}
                        className="text-white/70 hover:text-[#52ffc9] text-lg sm:text-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#52ffc9] focus:ring-opacity-50 rounded-full p-1"
                    >
                        {icon}
                    </a>
                ))}
            </footer>

            {/* Copyright */}
            <div className="absolute bottom-4 right-4 sm:right-6 md:right-8 text-xs text-white/40 z-20">© 2025 WibeeX. All Rights Reserved.</div>

            <style>{`
                /* Optimize animations for performance */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                /* Reduce motion for users who prefer it */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
                
                /* Optimize for mobile performance */
                @media (max-width: 768px) {
                    .blur-3xl {
                        filter: blur(1.5rem);
                    }
                }
                
                /* iPhone 7 and small mobile optimizations */
                @media (max-width: 375px) {
                    .blur-3xl {
                        filter: blur(1rem);
                    }
                    
                    /* Ensure countdown fits perfectly on iPhone 7 */
                    .grid-cols-4 {
                        gap: 0.25rem;
                    }
                }
                
                /* Extra small screens */
                @media (max-width: 320px) {
                    .blur-3xl {
                        filter: blur(0.75rem);
                    }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;