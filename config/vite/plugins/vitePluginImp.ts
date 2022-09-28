import vitePluginImp from 'vite-plugin-imp';

export default function vitePluginImpConfig() {
  return vitePluginImp({
    libList: [
      {
        libName: 'antd',
        style: (name) => `antd/es/${name}/style`,
        libDirectory: 'es',
      },
    ],
  });
}
