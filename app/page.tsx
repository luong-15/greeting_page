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
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
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
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6;
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
      const x = Math.random() * canvas.width;
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
      const x = Math.random() * canvas.width;
      const y = canvas.height + 20;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        ctx.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');

        if (p.type === 'heart') {
          // Draw heart shape
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(p.radius / 10, p.radius / 10);
          ctx.beginPath();
          ctx.moveTo(0, 3);
          ctx.bezierCurveTo(0, 1.5, -1.5, 0, -3, 0);
          ctx.bezierCurveTo(-6, 0, -6, 3.75, -6, 3.75);
          ctx.bezierCurveTo(-6, 6, -3, 9, 0, 12);
          ctx.bezierCurveTo(3, 9, 6, 6, 6, 3.75);
          ctx.bezierCurveTo(6, 3.75, 6, 0, 3, 0);
          ctx.bezierCurveTo(1.5, 0, 0, 1.5, 0, 3);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'blossom') {
          // Draw peach blossom with 5 petals
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = p.color;
          const petalRadius = p.radius * 0.4;
          const centerRadius = p.radius * 0.2;

          // Draw center
          ctx.beginPath();
          ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw 5 petals
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const petalX = Math.cos(angle) * p.radius * 0.6;
            const petalY = Math.sin(angle) * p.radius * 0.6;
            ctx.beginPath();
            ctx.arc(petalX, petalY, petalRadius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Music Toggle Button */}
      <button
        onClick={toggleAudio}
        className="fixed top-[4vw] right-[4vw] sm:top-[3vw] sm:right-[3vw] z-20 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white font-bold py-[1vw] px-[2vw] sm:py-[1.5vw] sm:px-[3vw] rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-[0.5vw] sm:gap-[1vw]"
        aria-label="Toggle background music"
      >
        <span className="text-[4vw] sm:text-[3vw]">{isPlaying ? '🔊' : '🔇'}</span>
        <span className="hidden sm:inline text-[3vw] sm:text-[2.5vw]">{isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}</span>
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-[2vh] sm:py-[3vh] md:py-[4vh] overflow-hidden">
        {/* Header Section */}
        <div className="mb-[4vh] sm:mb-[6vh] md:mb-[8vh] text-center space-y-[1vh] sm:space-y-[2vh]">
          <p className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] text-yellow-300 font-semibold drop-shadow-md tracking-widest">
            ✨ Chào mừng năm mới ✨
          </p>
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-red-200 drop-shadow-lg">
            2026
          </h1>
        </div>

        {/* Greeting Card Section */}
        <div className="w-full max-w-4xl mb-[4vh] sm:mb-[6vh] px-4 relative">

          <div
            className="card-container relative w-full h-auto min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[75vh] xl:min-h-[80vh] cursor-pointer"
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
                className="absolute w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-amber-700 rounded-[3vw] shadow-2xl overflow-hidden flex flex-col p-[6vw] sm:p-[8vw] md:p-[10vw]"
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Decorative border with glow effect */}
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-3xl opacity-20 pointer-events-none animate-pulse"></div>
                <div className="absolute inset-0 border-2 border-yellow-300 rounded-3xl opacity-30 pointer-events-none" style={{
                  animation: 'glow 2s ease-in-out infinite alternate'
                }}></div>
                {/* Sparkle effects around border */}
                <div className="absolute -top-2 -left-2 text-yellow-300 text-xl animate-bounce">✦</div>
                <div className="absolute -top-2 -right-2 text-yellow-300 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>✦</div>
                <div className="absolute -bottom-2 -left-2 text-yellow-300 text-xl animate-bounce" style={{ animationDelay: '1s' }}>✦</div>
                <div className="absolute -bottom-2 -right-2 text-yellow-300 text-xl animate-bounce" style={{ animationDelay: '1.5s' }}>✦</div>
                
                {/* Decorative corner ornaments */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-2xl sm:text-3xl opacity-70">✦</div>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-2xl sm:text-3xl opacity-70">✦</div>
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-2xl sm:text-3xl opacity-70">✦</div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-2xl sm:text-3xl opacity-70">✦</div>
                
                {/* Closed State - Card Back Content */}
                <div className="text-center space-y-[3vh] sm:space-y-[4vh] flex flex-col justify-center h-full">
                  {/* Top Decoration - Ornate */}
                  <div className="space-y-[2vh] sm:space-y-[3vh]">
                    <div className="text-[8vw] sm:text-[6vw] md:text-[5vw] drop-shadow-lg animate-bounce">🎐</div>
                    <div className="h-[0.5vh] bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-40"></div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-[1vh] sm:space-y-[2vh]">
                    <h2 className="text-[6vw] sm:text-[5vw] md:text-[4vw] lg:text-[3.5vw] xl:text-[3vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-200 drop-shadow-lg leading-tight">
                      2026
                    </h2>
                    <div className="space-y-[0.5vh] sm:space-y-[1vh]">
                      <p className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-bold text-yellow-300 drop-shadow-md">
                        Năm của Bình Ngọ
                      </p>
                      <p className="text-[3vw] sm:text-[2.5vw] text-yellow-200 font-medium">
                        Year of the Horse
                      </p>
                    </div>
                  </div>

                  {/* Decorative divider */}
                  <div className="h-[0.5vh] bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-40"></div>

                  {/* Action Button */}
                  <div className="space-y-[1vh] sm:space-y-[2vh]">
                    <button className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-200 text-red-800 font-bold py-[1vh] px-[4vw] sm:py-[1.5vh] sm:px-[6vw] rounded-full shadow-lg hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] leading-none">
                      Mở Thư
                    </button>
                    <p className="text-yellow-300 text-[3vw] sm:text-[2.5vw] font-semibold drop-shadow-md leading-tight">
                      Nhấp để mở lời chúc mừng
                    </p>
                  </div>

                  {/* Bottom Decoration */}
                  <div className="flex justify-center gap-[2vw] sm:gap-[3vw] text-[5vw] sm:text-[4vw] md:text-[3vw] opacity-50">
                    <span>🧧</span>
                    <span>🎊</span>
                    <span>🧧</span>
                  </div>
                </div>
              </div>

              {/* Back - Open State */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-amber-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center p-7 sm:p-11"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  minHeight: 'inherit',
                }}
              >
                {/* Decorative border */}
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-3xl opacity-20 pointer-events-none"></div>
                
                {/* Decorative corner ornaments */}
                <div className="absolute top-[4vw] left-[4vw] text-[2vw] opacity-60 animate-spin" style={{ animationDuration: '3s' }}>✦</div>
                <div className="absolute top-[4vw] right-[4vw] text-[2vw] opacity-60 animate-spin" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>✦</div>
                <div className="absolute bottom-[4vw] left-[4vw] text-[2vw] opacity-60 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>✦</div>
                <div className="absolute bottom-[4vw] right-[4vw] text-[2vw] opacity-60 animate-spin" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>✦</div>

                {/* Open State - Card Inner Content */}
                <div className="relative space-y-[2vh] sm:space-y-[3vh] text-center px-[2vw] sm:px-[4vw]">
                  {/* Main Greeting Title */}
                  <div className="space-y-[0.5vh] sm:space-y-[1vh]">
                    <h3 className="text-[5vw] sm:text-[4vw] md:text-[3vw] font-bold text-yellow-300 drop-shadow-lg">
                      Chúc Mừng Năm Mới
                    </h3>
                    <p className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] font-bold text-red-100 drop-shadow-md">
                      Năm Bình Ngọ 2026
                    </p>
                  </div>

                  {/* Main Wish Message */}
                  <div className="bg-yellow-100 bg-opacity-90 rounded-[2vw] sm:rounded-[2.5vw] py-[2vh] sm:py-[3vh] px-[3vw] sm:px-[4vw] shadow-md border-2 border-red-400 mx-[1vw] sm:mx-[2vw]">
                    <p className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] font-bold text-red-700 leading-tight">
                      Vạn Sự Như Ý
                    </p>
                    <p className="text-[3vw] sm:text-[2.5vw] text-red-600 font-medium mt-[1vh]">
                      Mọi điều như ý muốn
                    </p>
                  </div>

                  {/* Blessings Section - Merged into one box */}
                  <div className="bg-gradient-to-r from-yellow-100 to-amber-50 rounded-[2vw] sm:rounded-[2.5vw] p-[2vw] sm:p-[3vw] border-2 border-red-300 shadow-md mx-[1vw] sm:mx-[2vw]">
                    {blessings.map((blessing, index) => (
                      <div key={index} className="mb-[1vh] sm:mb-[2vh] last:mb-0">
                        <h4 className="text-[3.5vw] sm:text-[3vw] md:text-[2.5vw] font-bold text-red-700 leading-tight">
                          {blessing.title}
                        </h4>
                        <p className="text-[3vw] sm:text-[2.5vw] text-red-600 leading-snug mt-[0.5vh] sm:mt-[1vh]">
                          {blessing.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center space-y-[1vh] sm:space-y-[2vh]">
                    <p className="text-[4vw] sm:text-[3.5vw] md:text-[3vw] font-bold text-yellow-300 drop-shadow-md">
                      Gửi chút lộc đầu năm
                    </p>
                    <div className="w-[20vw] h-[20vw] sm:w-[24vw] sm:h-[24vw] max-w-[8rem] max-h-[8rem] bg-white border-4 border-red-400 rounded-[2vw] sm:rounded-[2.5vw] flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                      <img
                        src="/placeholder.svg?height=128&width=128"
                        alt="QR Code"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Closing Message */}
                  <div className="space-y-[0.5vh] sm:space-y-[1vh]">
                    <p className="text-[3vw] sm:text-[2.5vw] text-yellow-200 drop-shadow-md font-semibold animate-pulse">
                      Gửi đến người thương yêu của anh
                    </p>
                    <p className="text-[4vw] sm:text-[3.5vw] font-bold text-yellow-300 drop-shadow-md animate-bounce">
                      Yêu Thương • Hạnh Phúc • Bên Nhau
                    </p>
                    <p className="text-[3vw] sm:text-[2.5vw] text-yellow-200 drop-shadow-md font-medium animate-pulse" style={{ animationDelay: '1s' }}>
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
