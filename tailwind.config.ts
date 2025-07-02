import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        light: {
          background: '#ffffff',
          text: '#000000',
          primary: '#0070f3',
          hover: '#0059b3',
          // 未聚焦颜色
          focus: '#77787b',
          // 浅灰色
          gray: '#a1a3a6',
          // 时间颜色
          time: '#77787b',
          // 正文颜色
          body: '#4f4f4f',
        },
        dark: {
          background: '#000000',
          text: '#ffffff',
          primary: '#00bcd4',
          hover: '#009ca3',
          focus: '#77787b',
        },
      },
    },
    animation: {
      slideUp: 'slideUp 1.5s ease-out forwards',  // 延长动画持续时间    
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      slideUp: {
        '0%': { transform: 'translateY(5%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
export default config;
