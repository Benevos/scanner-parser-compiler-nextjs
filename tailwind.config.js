/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      rotate: {
        '75': '75deg',
        '135': '135deg',
        '140': '140deg',
        '145': '145deg'
      },
      gridTemplateColumns: {
        'layout': 'auto, auto, auto, 700px', 
        'layout-md': 'auto, auto, auto, 500px', 
      }
    },
  },
  plugins: [],
}
