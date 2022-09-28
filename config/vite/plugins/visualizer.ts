/**
 * 包依赖分析
 * https://github.com/btd/rollup-plugin-visualizer
 */
import visualizer from 'rollup-plugin-visualizer'

export default function visualizerConfig() {
  return visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true
  })
}
