import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
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

    // Matrix characters (using a mix of katakana and numbers for authentic look)
    const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・.";=*+-<>¦｜╌';
    const fontSize = 20;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    ctx.font = `${fontSize}px 'Share Tech Mono'`;

    const draw = () => {
      // Less transparent fade effect for more visible trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Enhanced Matrix green effect
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;

        // Create gradient for each character
        const brightness = Math.random();
        if (brightness > 0.98) {
          ctx.fillStyle = '#ffffff'; // Brightest characters
        } else if (brightness > 0.9) {
          ctx.fillStyle = '#00ff00'; // Full matrix green
        } else {
          ctx.fillStyle = '#003300'; // Darker matrix green
        }

        // Draw the character
        ctx.fillText(char, i * fontSize, y);

        // Reset drop to top when it reaches bottom
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
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
      className="fixed top-0 left-0 w-full h-full"
      style={{ 
        opacity: 0.8,
        zIndex: -1,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default MatrixBackground;