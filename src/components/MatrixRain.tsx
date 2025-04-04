import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (mix of katakana, numbers, and matrix-style symbols)
    const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:・.";=*+-<>¦｜╌';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    const glowIntensity: number[] = [];
    const speed: number[] = []; // Array to store different speeds for each column

    // Initialize drops, glow intensity, and speeds
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
      glowIntensity[i] = Math.random();
      speed[i] = 0.25 + Math.random() * 0.75; // Further reduced speed range
    }

    // Set up the font
    ctx.font = `${fontSize}px 'Share Tech Mono'`;

    const draw = () => {
      // Semi-transparent fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Update glow intensity with smooth transition
        glowIntensity[i] += (Math.random() - 0.5) * 0.1;
        glowIntensity[i] = Math.max(0, Math.min(1, glowIntensity[i]));
        
        // Calculate y position
        const y = drops[i] * fontSize;

        // Enhanced glow effect based on intensity
        const brightness = glowIntensity[i];
        if (brightness > 0.8) {
          // Brightest characters with strong glow
          ctx.fillStyle = '#7fff7f';
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 20; // Increased glow
          ctx.globalAlpha = 1;
        } else if (brightness > 0.5) {
          // Medium brightness with moderate glow
          ctx.fillStyle = '#00ff00';
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 15; // Increased glow
          ctx.globalAlpha = 0.95;
        } else {
          // Dimmer characters with subtle glow
          ctx.fillStyle = '#006400';
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10; // Increased glow
          ctx.globalAlpha = 0.9;
        }

        // Random character size variation for depth effect
        const sizeVariation = 0.8 + (Math.random() * 0.4); // 80% to 120% of original size
        ctx.font = `${fontSize * sizeVariation}px 'Share Tech Mono'`;

        // Draw the character
        ctx.fillText(char, i * fontSize, y);
        
        // Reset shadow and alpha properties
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Reset drop to top when it reaches bottom with varied randomness
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speed[i] = 0.25 + Math.random() * 0.75; // Further reduced speed range when resetting
        }

        // Move drop down with varied speed
        drops[i] += speed[i];
      }
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        opacity: 0.95, // Increased opacity
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default MatrixRain;