import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // extendに入れると既存のものから足すことができる
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        "MochiyPopOne": ["var(--font-MochiyPopOne)"],
        "ZenMaru": ["var(--font-ZenMaru)"],
        "KosugiMaru": ["var(--font-KosugiMaru)"],
        "Mandali": ["var(--font-Mandali)"],
        "LuloClean": ["var(--font-LuloClean)"],
      },
      colors: {
        "main": "var(--main-color)",
        "main-soft": "var(--main-color-soft)",
        "main-pale": "var(--main-color-pale)",
        "main-fluo": "var(--main-color-fluo)",
        "main-pale-fluo": "var(--main-color-pale-fluo)",
        "main-strong": "var(--main-color-strong)",
        "main-deep": "var(--main-color-deep)",
        "main-dark": "var(--main-color-dark)",
        "main-grayish": "var(--main-color-grayish)",
        "main-grayish-fluo": "var(--main-color-grayish-fluo)",
        "main-light-grayish": "var(--main-color-light-grayish)",
        "sub-color": "var(--sub-color)",
        "sub-color-soft": "var(--sub-color-soft)",
        "sub-color-strong": "var(--sub-color-strong)",
        "text-color": "var(--text-color)",
        "background-top": "var(--background-top)",
        "background-bottom": "var(--background-bottom)",
        "lightbox-background": "var(--lightbox-background)",
        "lightbox-background-preview": "var(--lightbox-background-preview)",
        "lightbox-background-text": "var(--lightbox-background-text)",
      },
    },
  },
  plugins: [],
}
export default config
