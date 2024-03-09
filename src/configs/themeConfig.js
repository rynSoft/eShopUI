// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: 'techiz',
    appLogoTemp: require('@src/assets/images/logo/symbol.png').default,
    appLogoImage: require('@src/assets/images/logo/techiz.png').default,
    appLogoImageSmall: require('@src/assets/images/logo/techizSmall.png').default,

  },
  layout: {
    isRTL: false,
    skin: 'dark', // light, dark, bordered, semi-dark
    routerTransition: 'zoomIn', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'horizontal', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'floating', // static , sticky , floating, hidden
      backgroundColor: 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'static' // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true // Enable scroll to top button
  }
}

export default themeConfig
