import type { ConfigEnv } from 'vite';
import path from 'path';
import pkg from './package.json';
import { PORT, VITE_BASE_PATH } from './config/constant';
import { createVitePlugins } from './config/vite/plugins';
import { themeVariables } from './config/theme';
import svgr from 'vite-plugin-svgr';
const { name, version } = pkg;

const __APP_INFO__ = {
  pkg: { name, version },
};

export default ({ command, mode }: ConfigEnv) => {
  const isBuild = command === 'build';
  console.log({ command, mode });

  return {
    base: VITE_BASE_PATH,
    plugins: [createVitePlugins(mode, isBuild), svgr()],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@c', replacement: path.resolve(__dirname, 'config') },
      ],
    },
    server: {
      host: true,
      port: PORT, // 开发环境启动的端口
      hmr: {
        overlay: false,
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      rollupOptions: {
        input: {
          default: 'index.html',
          about: 'about.html',
          shortNote: "short_note.html",
          searchResult: "search_result.html",
          localApi: "local_api.html",
        },
      },
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: false,
          drop_debugger: true,
        },
      },
    },
    define: {
      // 设置应用信息
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
};
