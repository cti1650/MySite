import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const resolvePath = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    /**
     * tsconfig.json の compilerOptions.paths と同じ内容を持つ。
     * vite-tsconfig-paths で自動追従もできるが、unmaintained な tsconfck を
     * 引き込むため手書きしている。tsconfig.json 側を変えたらここも変える。
     */
    alias: {
      '@comp': resolvePath('./src/components'),
      '@lib': resolvePath('./src/lib'),
      '@hooks': resolvePath('./src/hooks'),
      '@img': resolvePath('./src/assets/images'),
      '@style': resolvePath('./styles'),
      src: resolvePath('./src'),
      styles: resolvePath('./styles'),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // 環境変数をモジュール読み込み時に評価するモジュール(src/lib/siteUrl.ts 等)が
    // あるため、ファイル間で process.env が混ざらないようプロセスを分離する
    isolate: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/hooks/**', 'src/components/**'],
      exclude: ['src/**/*.test.{ts,tsx}'],
    },
  },
});
