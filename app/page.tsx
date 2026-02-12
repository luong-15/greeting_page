'use client';

import React, { useEffect, useRef, useState } from 'react';

const blessings = [
  {
    title: 'Tình Yêu Vĩnh Cửu',
    text: 'Tình yêu chúng ta mãi bền vững, như dòng sông chảy mãi không ngừng, bên nhau đến cuối đời'
  }
];

export default function NewYearGreeting() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentWish, setCurrentWish] = useState(0);

  // Fireworks and falling blossoms animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Enable high DPI support
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
      canvas!.style.width = width + 'px';
      canvas!.style.height = height + 'px';
    };

    updateCanvasSize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
      radius: number;
      color: string;
      type: 'firework' | 'blossom' | 'heart';
    }> = [];

    function createFirework() {
      const x = Math.random() * canvas!.width;
      const y = Math.random() * canvas!.height * 0.6;
      const colors = ['#FFD700', '#DC143C', '#FF6B6B', '#FFB6C1'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 2 + Math.random() * 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          age: 0,
          life: 60 + Math.random() * 40,
          radius: 2 + Math.random() * 2,
          color,
          type: 'firework',
        });
      }
    }

    function createBlossom() {
      const x = Math.random() * canvas!.width;
      const y = -10;
      const colors = ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FF1493']; // Pink colors for peach blossoms
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5, // Diagonal fall
        vy: 0.6 + Math.random() * 0.3, // Gentle fall
        age: 0,
        life: 400 + Math.random() * 300,
        radius: 8 + Math.random() * 4, // Size for flower
        color,
        type: 'blossom',
      });
    }

    function createHeart() {
      const x = Math.random() * canvas!.width;
      const y = canvas!.height + 20;
      const colors = ['#FFFFFF', '#FFFF00', '#FFD700', '#FFA500'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(2 + Math.random() * 3),
        age: 0,
        life: 300 + Math.random() * 200,
        radius: 15 + Math.random() * 10,
        color,
        type: 'heart',
      });
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Create new particles occasionally
      if (Math.random() < 0.2) {
        createBlossom();
      }
      if (Math.random() < 0.015) {
        createFirework();
      }
      if (Math.random() < 0.02) {
        createHeart();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;

        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'firework') {
          p.vy += 0.05; // gravity
        } else if (p.type === 'heart') {
          p.vy += 0.02; // slight gravity for hearts
          p.vx *= 0.99; // air resistance
        }

        const opacity = 1 - p.age / p.life;
        ctx!.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');

        if (p.type === 'heart') {
          // Draw heart shape
          ctx!.save();
          ctx!.translate(p.x, p.y);
          ctx!.scale(p.radius / 10, p.radius / 10);
          ctx!.beginPath();
          ctx!.moveTo(0, 3);
          ctx!.bezierCurveTo(0, 1.5, -1.5, 0, -3, 0);
          ctx!.bezierCurveTo(-6, 0, -6, 3.75, -6, 3.75);
          ctx!.bezierCurveTo(-6, 6, -3, 9, 0, 12);
          ctx!.bezierCurveTo(3, 9, 6, 6, 6, 3.75);
          ctx!.bezierCurveTo(6, 3.75, 6, 0, 3, 0);
          ctx!.bezierCurveTo(1.5, 0, 0, 1.5, 0, 3);
          ctx!.fill();
          ctx!.restore();
        } else if (p.type === 'blossom') {
          // Draw peach blossom with 5 petals
          ctx!.save();
          ctx!.translate(p.x, p.y);
          ctx!.fillStyle = p.color;
          const petalRadius = p.radius * 0.4;
          const centerRadius = p.radius * 0.2;

          // Draw center
          ctx!.beginPath();
          ctx!.arc(0, 0, centerRadius, 0, Math.PI * 2);
          ctx!.fill();

          // Draw 5 petals
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const petalX = Math.cos(angle) * p.radius * 0.6;
            const petalY = Math.sin(angle) * p.radius * 0.6;
            ctx!.beginPath();
            ctx!.arc(petalX, petalY, petalRadius, 0, Math.PI * 2);
            ctx!.fill();
          }
          ctx!.restore();
        } else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Audio playback failed, but continue
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-amber-900 relative">
      {/* Canvas for animations */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Music Toggle Button */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        aria-label="Toggle background music"
      >
        <span className="text-lg sm:text-2xl">{isPlaying ? '🔊' : '🔇'}</span>
        <span className="hidden sm:inline text-sm sm:text-base">{isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}</span>
      </button>

      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        crossOrigin="anonymous"
      >
        {/* Replace with actual festive audio source */}
      </audio>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-3 py-4 sm:py-6 md:py-8 overflow-hidden">
        {/* Header Section */}
        <div className="mb-4 sm:mb-5 md:mb-6 text-center space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm md:text-base text-yellow-300 font-semibold drop-shadow-md tracking-widest">
            ✨ Chào mừng năm mới ✨
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-red-200 drop-shadow-lg">
            2026
          </h1>
        </div>

        {/* Greeting Card Section */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mb-3 sm:mb-4 px-0 relative">

          <div
            className="card-container relative w-full h-auto min-h-96 sm:min-h-96 md:min-h-96 lg:min-h-[32rem] cursor-pointer"
            onClick={() => setIsCardOpen(!isCardOpen)}
            style={{
              perspective: '1200px',
            }}
          >
            {/* Card wrapper for 3D flip */}
            <div
              className="relative w-full transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isCardOpen ? 'rotateY(180deg)' : 'rotateY(0deg)',
                height: '100%',
                minHeight: 'inherit',
              }}
            >
              {/* Front - Closed State */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-amber-700 rounded-xl sm:rounded-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col p-5 sm:p-6 md:p-6"
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Decorative border with glow effect */}
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl sm:rounded-3xl opacity-20 pointer-events-none animate-pulse"></div>
                <div className="absolute inset-0 border-2 border-yellow-300 rounded-2xl sm:rounded-3xl opacity-30 pointer-events-none" style={{
                  animation: 'glow 2s ease-in-out infinite alternate'
                }}></div>
                {/* Sparkle effects around border */}
                <div className="absolute -top-1 -left-1 text-yellow-300 text-sm animate-bounce">✦</div>
                <div className="absolute -top-1 -right-1 text-yellow-300 text-sm animate-bounce" style={{ animationDelay: '0.5s' }}>✦</div>
                <div className="absolute -bottom-1 -left-1 text-yellow-300 text-sm animate-bounce" style={{ animationDelay: '1s' }}>✦</div>
                <div className="absolute -bottom-1 -right-1 text-yellow-300 text-sm animate-bounce" style={{ animationDelay: '1.5s' }}>✦</div>
                
                {/* Decorative corner ornaments */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xl sm:text-2xl opacity-70">✦</div>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-2xl opacity-70">✦</div>
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-xl sm:text-2xl opacity-70">✦</div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-xl sm:text-2xl opacity-70">✦</div>
                
                {/* Closed State - Card Back Content */}
                <div className="text-center space-y-3 sm:space-y-4 flex flex-col justify-center h-full">
                  {/* Top Decoration - Ornate */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg animate-bounce">🎐</div>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-40"></div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-200 drop-shadow-lg leading-tight">
                      2026
                    </h2>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-base sm:text-lg md:text-xl font-bold text-yellow-300 drop-shadow-md">
                        Năm của Bình Ngọ
                      </p>
                      <p className="text-sm sm:text-base text-yellow-200 font-medium">
                        Year of the Horse
                      </p>
                    </div>
                  </div>

                  {/* Decorative divider */}
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-40"></div>

                  {/* Action Button */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <button className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-200 text-red-800 font-bold py-2 px-4 sm:py-2.5 sm:px-6 rounded-full shadow-lg hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base">
                      Mở Thư
                    </button>
                    <p className="text-yellow-300 text-xs sm:text-sm font-semibold drop-shadow-md">
                      Nhấp để mở lời chúc mừng
                    </p>
                  </div>

                  {/* Bottom Decoration */}
                  <div className="flex justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl opacity-50">
                    <span>🧧</span>
                    <span>🎊</span>
                    <span>🧧</span>
                  </div>
                </div>
              </div>

              {/* Back - Open State */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-amber-700 rounded-xl sm:rounded-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-center p-5 sm:p-6 md:p-6"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  minHeight: 'inherit',
                }}
              >
                {/* Decorative border */}
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl sm:rounded-3xl opacity-20 pointer-events-none"></div>
                
                {/* Decorative corner ornaments */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-lg sm:text-xl opacity-60 animate-spin" style={{ animationDuration: '3s' }}>✦</div>
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-lg sm:text-xl opacity-60 animate-spin" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>✦</div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-lg sm:text-xl opacity-60 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>✦</div>
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-lg sm:text-xl opacity-60 animate-spin" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>✦</div>

                {/* Open State - Card Inner Content */}
                <div className="relative space-y-2 text-center px-3 sm:px-4 flex flex-col justify-center h-full">
                  {/* Main Greeting Title */}
                  <div className="space-y-0.5">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 drop-shadow-lg leading-tight">
                      Chúc Mừng Năm Mới
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-red-100 drop-shadow-md leading-tight">
                      Năm Bình Ngọ 2026
                    </p>
                  </div>

                  {/* Main Wish Message */}
                  <div className="bg-yellow-100 bg-opacity-90 rounded-md py-1.5 sm:py-2 px-3 shadow-md border-2 border-red-400">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-red-700 leading-tight">
                      Vạn Sự Như Ý
                    </p>
                    <p className="text-xs sm:text-xs md:text-sm text-red-600 font-medium mt-0.5">
                      Mọi điều như ý muốn
                    </p>
                  </div>

                  {/* Blessings Section - Merged into one box */}
                  <div className="bg-gradient-to-r from-yellow-100 to-amber-50 rounded-md p-2 border-2 border-red-300 shadow-md">
                    {blessings.map((blessing, index) => (
                      <div key={index} className="mb-0.5 last:mb-0">
                        <h4 className="text-xs sm:text-sm md:text-base font-bold text-red-700 leading-tight">
                          {blessing.title}
                        </h4>
                        <p className="text-xs md:text-xs text-red-600 leading-snug">
                          {blessing.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-yellow-300 drop-shadow-md leading-tight">
                      Gửi chút lộc đầu năm
                    </p>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-red-400 rounded flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                      <img
                        src="/assets/qrcode.png" // Updated path to public/assets/qrcode.png
                        alt="QR Code"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Closing Message */}
                  <div className="space-y-0.5 text-center">
                    <p className="text-xs text-yellow-200 drop-shadow-md font-semibold animate-pulse leading-tight">
                      Gửi đến người thương yêu của anh
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-yellow-300 drop-shadow-md animate-bounce leading-tight">
                      Yêu Thương • Hạnh Phúc • Bên Nhau
                    </p>
                    <p className="text-xs text-yellow-200 drop-shadow-md font-medium animate-pulse leading-tight" style={{ animationDelay: '1s' }}>
                      Năm mới Bình Ngọ 2026 - Tình yêu vĩnh cửu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
