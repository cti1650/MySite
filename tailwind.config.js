module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        n2i: [
          'Oswald',
          'Yu Gothic Medium',
          '游ゴシック Medium',
          'YuGothic',
          '游ゴシック体',
          'ヒラギノ角ゴ Pro W3',
          'メイリオ',
          'sans-serif',
        ],
      },
    },
  },
  variants: {
    extend: {},
    width: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
};
