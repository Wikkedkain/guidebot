module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.svelte'
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'focus', 'hover', 'active'],
    textColor: ['responsive', 'focus', 'hover', 'active']
  },
  plugins: [],
}
