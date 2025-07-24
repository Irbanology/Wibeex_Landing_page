import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import logoPng from '../assets/logo_Png.png';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

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
  const blobs = useRef([]);

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

  useEffect(() => {
    const animateBlobs = () => {
      const t = Date.now() / 2000;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;
      const blobSize = isMobile ? 200 : 300;
      const radius = Math.min(w, h) * (isMobile ? 0.25 : 0.4);

      blobs.current.forEach((blob, index) => {
        const angle = t + index * (Math.PI / 2);
        const x = w / 2 + Math.cos(angle) * radius - blobSize / 2;
        const y = h / 2 + Math.sin(angle) * radius - blobSize / 2;
        if (blob) {
          blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          blob.style.display = 'block';
        }
      });
    };

    let animationId = requestAnimationFrame(function animate() {
      animateBlobs();
      animationId = requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const logo = logo3DRef.current;
    if (!logo) return;
    let ticking = false;

    const animate = (clientX, clientY) => {
      const rect = logo.getBoundingClientRect();
      const logoX = rect.left + rect.width / 2;
      const logoY = rect.top + rect.height / 2;
      const dx = clientX - logoX;
      const dy = clientY - logoY;
      const maxTilt = 20;
      const rotateY = Math.max(-maxTilt, Math.min(maxTilt, dx / 12));
      const rotateX = Math.max(-maxTilt, Math.min(maxTilt, -dy / 12));
      logo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          animate(e.clientX, e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!ticking && e.touches.length === 1) {
        requestAnimationFrame(() => {
          animate(e.touches[0].clientX, e.touches[0].clientY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const resetTransform = () => logo.style.transform = '';

    logo.addEventListener('mousemove', handleMouseMove);
    logo.addEventListener('mouseleave', resetTransform);
    logo.addEventListener('touchmove', handleTouchMove);
    logo.addEventListener('touchend', resetTransform);

    return () => {
      logo.removeEventListener('mousemove', handleMouseMove);
      logo.removeEventListener('mouseleave', resetTransform);
      logo.removeEventListener('touchmove', handleTouchMove);
      logo.removeEventListener('touchend', resetTransform);
    };
  }, []);

  const handleImageLoad = useCallback(() => setIsLoaded(true), []);
  const handleImageError = useCallback(() => setIsLoaded(true), []);

  const countdownDisplay = useMemo(() => (
    <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 text-white font-bold mb-6 sm:mb-8 max-w-xs sm:max-w-sm mx-auto">
      {['days', 'hours', 'minutes', 'seconds'].map((key, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-none">
            {timeLeft[key].toString().padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm font-normal mt-1 text-white/70">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        </div>
      ))}
    </div>
  ), [timeLeft]);

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a1a2f] via-[#0a1a2f] to-[#0e223a] font-poppins">
      <header className="flex justify-between items-center px-4 pt-4 sm:px-6 md:px-8 sm:pt-6">
        <span className="text-white font-bold tracking-widest text-base sm:text-lg">
          WIBEE<span className="text-[#e552ff]">X</span>
        </span>
      </header>

      {[0, 1, 2, 3].map((_, i) => (
        <div
          key={i}
          ref={(el) => blobs.current[i] = el}
          className="absolute rounded-full blur-3xl pointer-events-none w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[600px] md:h-[600px] opacity-30"
          style={{
            background: i % 2 === 0
              ? 'radial-gradient(circle at 60% 40%, #e552ff 60%, transparent 100%)'
              : 'radial-gradient(circle at 40% 60%, #52ffc9 60%, transparent 100%)',
            zIndex: 0,
            willChange: 'transform',
            display: 'block'
          }}
          aria-hidden="true"
        />
      ))}

      <main className="flex-1 flex flex-col justify-center items-center relative z-10 w-full px-4">
        <div className="w-full text-center sm:max-w-xl sm:mx-auto">
          <img
            ref={logo3DRef}
            src={logoPng}
            alt="WibeEx Logo"
            className={`w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain mx-auto mb-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager"
          />
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 px-2 leading-tight">Simple. Secure. Smart.</h1>
          <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg px-2 leading-relaxed">The new age of digital trading is coming.</p>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base md:text-lg font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2 px-2">
            <span className="text-lg sm:text-xl md:text-2xl" role="img" aria-label="rocket">🚀</span>
            <span className="bg-gradient-to-r from-[#e552ff] to-[#52ffc9] text-transparent bg-clip-text">
              Expected launch on <span className="underline underline-offset-2">October 10 2025</span>.
            </span>
          </p>
          {countdownDisplay}
        </div>
      </main>

      <footer className="mt-auto w-full flex flex-col items-center gap-2 py-4 px-4 bg-transparent sm:flex-row sm:justify-between sm:items-center sm:gap-4 sm:px-8 sm:py-6">
        <div className="flex gap-4 mb-1 sm:mb-0">
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
        </div>
        <div className="text-xs text-white/40 text-center max-w-full sm:text-right">
          © 2025 WibeeX. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;