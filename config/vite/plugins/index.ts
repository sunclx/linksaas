/**
 * vite plugin
 */

import type { PluginOption } from 'vite';
import { VITE_APP_ANALYZE } from '../../constant';
import visualizerPlugin from './visualizer';
import legacyPlugin from './legacy';
//import vitePluginImpPlugin from './vitePluginImp'
import react from '@vitejs/plugin-react';

export function createVitePlugins(viteEnv: string, isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    react({
      babel: {
        babelrc: true,
      },
    }),
  ];

  vitePlugins.push(legacyPlugin());
  // vitePlugins.push(vitePluginImpPlugin())
  VITE_APP_ANALYZE && vitePlugins.push(visualizerPlugin());

  return vitePlugins;
}
