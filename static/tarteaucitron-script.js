tarteaucitron.init({
  privacyUrl: '' /* Privacy policy url */,

  hashtag: '#tarteaucitron' /* Open the panel with this hashtag */,
  cookieName: 'tarteaucitron' /* Cookie name */,

  orientation: 'middle' /* Banner position (top - bottom) */,
  showAlertSmall: true /* Show the small banner on bottom right */,
  cookieslist: true /* Show the cookie list */,

  adblocker: false /* Show a Warning if an adblocker is detected */,
  DenyAllCta: true /* Show the deny all button */,
  AcceptAllCta: true /* Show the accept all button when highPrivacy on */,
  highPrivacy: true /* Disable auto consent */,
  handleBrowserDNTRequest: false /* If Do Not Track == 1, disallow all */,

  removeCredit: false /* Remove credit link */,
  moreInfoLink: true /* Show more info link */,
  useExternalCss: false /* If false, the tarteaucitron.css file will be loaded */,

  // "cookieDomain": ".my-multisite-domaine.fr", /* Shared cookie for subdomain website */

  readmoreLink:
    '/cookiespolicy' /* Change the default readmore link pointing to tarteaucitron.io */,

  mandatory: false /* Show a message about mandatory cookies */,
})
