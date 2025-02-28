import type { ConfigEnv } from 'vite';
import path from 'path';
import pkg from './package.json';
import { PORT, VITE_BASE_PATH } from './config/constant';
import { createVitePlugins } from './config/vite/plugins';
import { themeVariables } from './config/theme';
import svgr from 'vite-plugin-svgr';
import topLevelAwait from "vite-plugin-top-level-await";

const { name, version } = pkg;

const __APP_INFO__ = {
  pkg: { name, version },
};

export default ({ command, mode }: ConfigEnv) => {
  const isBuild = command === 'build';
  console.log({ command, mode });

  return {
    base: VITE_BASE_PATH,
    plugins: [
      createVitePlugins(mode, isBuild),
      svgr(),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: "__tla",
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: i => `__tla_${i}`
      }),
    ],
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
          localApi: "local_api.html",
          gitDiff: "git_diff.html",
          dataAnno: "data_anno.html",
          apiGrpc: "api_grpc.html",
          apiSwagger: "api_swagger.html",
          apiCustom: "api_custom.html",
          k8sWin: "k8swin.html",
          swarmWin: "swarmwin.html",
          devc: "devc.html",
          gitPro: "gitpro.html"
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
