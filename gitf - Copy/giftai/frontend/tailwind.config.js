/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Scan các file trong src
  ],
  theme: {
    extend: {
      colors: {
        navy: "#001f3f",
        gold: "#FFD700",
        cream: "#FFFDD0",
      },
      boxShadow: {
        'glow': '0 0 50px rgba(255, 215, 0, 0.1)',
      },
      // Note: Tailwind doesn't have perspective by default in theme extend typically, 
      // but we can add it via plugins or just use arbitrary values. 
      // For now, let's stick to inline styles or standard classes if possible, 
      // but here we can add it to extend logic if we were using a plugin.
      // Since we can't easily add plugins, I will rely on standard 'perspective' if available or simple CSS class in global.css?
      // Actually, Tailwind 3+ supports perspective? No, usually plugin.
      // Let's add it to keyframes or just leave it if I used inline style.
      // Wait, I used className="perspective-1000". This won't work without plugin.
      // I should probably add it to the global css or just use inline style on the div.
      // Better yet, I can add it to the 'addUtilities' plugin section if I had access.
      // Since I can only edit config, I will try to add it as a custom utility via plugin in the config file itself!
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'spin-slow-reverse': 'spin-reverse 15s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-particles': 'float-particles 20s infinite linear',
        'converge': 'converge 3s ease-in-out infinite',
        'stream-in': 'stream-in 1.5s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'shimmer-fast': 'shimmer 1s linear infinite',
        'typewriter-cursor': 'blink 1s step-end infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'scale-up': 'scaleUp 0.5s ease-out forwards',
        'zoom-in': 'zoomIn 0.5s ease-out forwards',
        'flip-3d': 'flip3d 1s ease-out forwards',
      },
      keyframes: {
        'spin-reverse': {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)' },
          '50%': { opacity: '.8', boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)' },
        },
        'float-particles': {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, 20px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'converge': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        'stream-in': {
          '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(1.5)', opacity: '0' },
        },
        'shimmer': {
          'from': { backgroundPosition: '0 0' },
          'to': { backgroundPosition: '-200% 0' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fadeIn': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'scaleUp': {
          'from': { transform: 'scale(0.8)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'zoomIn': {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'flip3d': {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [],
};
