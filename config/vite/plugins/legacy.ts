import legacy from '@vitejs/plugin-legacy'

export default function legacyConfig() {
  return legacy({
    targets: ["> 1%",
      "last 2 version",
      "not dead",
      "not ie <= 11",
      "maintained node versions",
      "not op_mini all"]
  })
}
