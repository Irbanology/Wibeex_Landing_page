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
    // Animated blob positions
    const [blobs, setBlobs] = useState([
        { x: 0, y: 0, r: 220, color: 'radial-gradient(circle at 60% 40%, #e552ff 60%, #52ffc9 100%)', opacity: 0.5 },
        { x: 0, y: 0, r: 180, color: 'radial-gradient(circle at 40% 60%, #52ffc9 60%, #e552ff 100%)', opacity: 0.4 },
        { x: 0, y: 0, r: 120, color: 'radial-gradient(circle at 50% 50%, #e552ff 60%, #52ffc9 100%)', opacity: 0.3 },
    ]);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const animationRef = useRef();
    const logo3DRef = useRef();

    // Memoize blob animation to prevent unnecessary re-renders
    const animateBlobs = useCallback(() => {
        const t = Date.now() / 1200;
        const w = window.innerWidth;
        const h = window.innerHeight;
        setBlobs([
            {
                x: w * 0.65 + Math.cos(t) * 120,
                y: h * 0.55 + Math.sin(t / 1.5) * 80,
                r: 220,
                color: 'radial-gradient(circle at 60% 40%, #e552ff 60%, #52ffc9 100%)',
                opacity: 0.5,
            },
            {
                x: w * 0.55 + Math.cos(t + Math.PI) * 100,
                y: h * 0.7 + Math.sin(t / 1.2 + Math.PI) * 60,
                r: 180,
                color: 'radial-gradient(circle at 40% 60%, #52ffc9 60%, #e552ff 100%)',
                opacity: 0.4,
            },
            {
                x: w * 0.25 + Math.cos(t / 1.3 + 1) * 80,
                y: h * 0.8 + Math.sin(t / 1.7 + 2) * 60,
                r: 120,
                color: 'radial-gradient(circle at 50% 50%, #e552ff 60%, #52ffc9 100%)',
                opacity: 0.3,
            },
        ]);
    }, []);

    useEffect(() => {
        const animate = () => {
            animateBlobs();
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animateBlobs]);

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
        
        calculateTimeLeft(); // Calculate immediately
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
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
                    const maxTilt = 30;
                    const rotateY = Math.max(-maxTilt, Math.min(maxTilt, dx / 8));
                    const rotateX = Math.max(-maxTilt, Math.min(maxTilt, -dy / 8));
                    logo3DRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Handle image load
    const handleImageLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    // Memoize countdown display
    const countdownDisplay = useMemo(() => (
        <div className="flex justify-center gap-6 text-white text-3xl font-bold mb-8">
            <div className="flex flex-col items-center">
                <span>{timeLeft.days}</span>
                <span className="text-xs font-normal mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center">
                <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center">
                <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
                <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1">Seconds</span>
            </div>
        </div>
    ), [timeLeft]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#0a1a2f] to-[#0e223a] flex flex-col justify-between overflow-hidden border-0 outline-none">
            {/* Top Bar */}
            <header className="flex justify-between items-center px-8 pt-6">
                <div className="flex items-center gap-2">
                    <span className="text-white font-bold tracking-widest text-lg">WIBEE<span className="text-[#e552ff]">X</span></span>
                </div>
            </header>
            
            {/* Animated Blobs */}
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    className="absolute rounded-full blur-3xl pointer-events-none"
                    style={{
                        width: blob.r * 2,
                        height: blob.r * 2,
                        left: blob.x - blob.r,
                        top: blob.y - blob.r,
                        background: blob.color,
                        opacity: blob.opacity,
                        zIndex: 0,
                        transition: 'left 0.2s linear, top 0.2s linear',
                    }}
                    aria-hidden="true"
                />
            ))}
            
            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center items-center relative z-10 px-4">
                <div className="max-w-xl w-full text-center mt-16">
                    {/* Centered logo above heading */}
                    <img 
                        ref={logo3DRef} 
                        src={logoPng} 
                        alt="WibeEx Logo" 
                        className={`w-40 h-40 object-contain mx-auto mb-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={handleImageLoad}
                        loading="eager"
                    />
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Simple. Secure. Smart.</h1>
                    <p className="text-white/80 mb-8">The new age of digital trading is coming.</p>
                    
                    {/* Expected launch date - styled prominently */}
                    <p className="mb-6 text-lg sm:text-xl font-extrabold text-center flex items-center justify-center gap-2">
                        <span className="text-2xl sm:text-3xl align-middle" role="img" aria-label="rocket">🚀</span>
                        <span className="bg-gradient-to-r from-[#e552ff] to-[#52ffc9] text-transparent bg-clip-text">
                            Expected launch on <span className="underline underline-offset-2">October 10 2025</span>.
                        </span>
                    </p>
                    
                    {/* Countdown */}
                    {countdownDisplay}
                </div>
            </main>
            
            {/* Social Icons Bottom Left */}
            <footer className="absolute left-8 bottom-6 flex gap-4 z-20">
                {socialLinks.map(({ href, icon, label }) => (
                    <a 
                        key={label} 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Follow us on ${label}`}
                        className="text-white/70 hover:text-[#52ffc9] text-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#52ffc9] focus:ring-opacity-50 rounded-full p-1"
                    >
                        {icon}
                    </a>
                ))}
            </footer>
            
            {/* Copyright */}
            <div className="absolute bottom-4 right-8 text-xs text-white/40 z-20">© 2025 WibeeX. All Rights Reserved.</div>
            
            <style>{`
                @keyframes float { 
                    0%,100%{transform:translateY(0);} 
                    50%{transform:translateY(-16px);} 
                }
                .animate-float { 
                    animation: float 3s ease-in-out infinite; 
                }
                
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
            `}</style>
        </div>
    );
};

export default LandingPage;