module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    // Tailwind 4 では PostCSS プラグインが本体から分離された。
    // ベンダープレフィックスは Tailwind 側が面倒を見るため autoprefixer は不要
    '@tailwindcss/postcss': {},
  },
};
