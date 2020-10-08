/* jslint browser: true, evil: true */

const scripts = document.getElementsByTagName('script')
const path = scripts[scripts.length - 1].src.split('?')[0]
var tarteaucitronForceCDN =
  tarteaucitronForceCDN === undefined ? '' : tarteaucitronForceCDN
const cdn =
  tarteaucitronForceCDN === ''
    ? path.split('/').slice(0, -1).join('/') + '/'
    : tarteaucitronForceCDN
var alreadyLaunch = alreadyLaunch === undefined ? 0 : alreadyLaunch
var tarteaucitronForceLanguage =
  tarteaucitronForceLanguage === undefined ? '' : tarteaucitronForceLanguage
var tarteaucitronForceExpire =
  tarteaucitronForceExpire === undefined ? '' : tarteaucitronForceExpire
var tarteaucitronCustomText =
  tarteaucitronCustomText === undefined ? '' : tarteaucitronCustomText
// tarteaucitronExpireInDay: true for day(s) value - false for hour(s) value
var tarteaucitronExpireInDay =
  tarteaucitronExpireInDay === undefined ||
  typeof tarteaucitronExpireInDay !== 'boolean'
    ? true
    : tarteaucitronExpireInDay
let timeExpire = 31536000000
let tarteaucitronProLoadServices
const tarteaucitronNoAdBlocker = false

var tarteaucitron = {
  version: 20201005,
  cdn,
  user: {},
  lang: {},
  services: {},
  added: [],
  idprocessed: [],
  state: [],
  launch: [],
  parameters: {},
  isAjax: false,
  reloadThePage: false,
  events: {
    init() {},
    load() {},
  },
  init(params) {
    'use strict'
    let origOpen

    tarteaucitron.parameters = params
    if (alreadyLaunch === 0) {
      alreadyLaunch = 1
      if (window.addEventListener) {
        window.addEventListener(
          'load',
          function () {
            tarteaucitron.initEvents.loadEvent(false)
          },
          false
        )
        window.addEventListener(
          'scroll',
          function () {
            tarteaucitron.initEvents.scrollEvent()
          },
          false
        )

        window.addEventListener(
          'keydown',
          function (evt) {
            tarteaucitron.initEvents.keydownEvent(false, evt)
          },
          false
        )
        window.addEventListener(
          'hashchange',
          function () {
            tarteaucitron.initEvents.hashchangeEvent()
          },
          false
        )
        window.addEventListener(
          'resize',
          function () {
            tarteaucitron.initEvents.resizeEvent()
          },
          false
        )
      } else {
        window.attachEvent('onload', function () {
          tarteaucitron.initEvents.loadEvent(true)
        })
        window.attachEvent('onscroll', function () {
          tarteaucitron.initEvents.scrollEvent()
        })
        window.attachEvent('onkeydown', function (evt) {
          tarteaucitron.initEvents.keydownEvent(true, evt)
        })
        window.attachEvent('onhashchange', function () {
          tarteaucitron.initEvents.hashchangeEvent()
        })
        window.attachEvent('onresize', function () {
          tarteaucitron.initEvents.resizeEvent()
        })
      }

      if (typeof XMLHttpRequest !== 'undefined') {
        origOpen = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function () {
          if (window.addEventListener) {
            this.addEventListener(
              'load',
              function () {
                if (typeof tarteaucitronProLoadServices === 'function') {
                  tarteaucitronProLoadServices()
                }
              },
              false
            )
          } else if (typeof this.attachEvent !== 'undefined') {
            this.attachEvent('onload', function () {
              if (typeof tarteaucitronProLoadServices === 'function') {
                tarteaucitronProLoadServices()
              }
            })
          } else if (typeof tarteaucitronProLoadServices === 'function') {
            setTimeout(tarteaucitronProLoadServices, 1000)
          }

          try {
            origOpen.apply(this, arguments)
          } catch (err) {}
        }
      }
    }

    if (tarteaucitron.events.init) {
      tarteaucitron.events.init()
    }
  },
  initEvents: {
    loadEvent(isOldBrowser) {
      tarteaucitron.load()
      tarteaucitron.fallback(
        ['tarteaucitronOpenPanel'],
        function (elem) {
          if (isOldBrowser) {
            elem.attachEvent('onclick', function (event) {
              tarteaucitron.userInterface.openPanel()
              event.preventDefault()
            })
          } else {
            elem.addEventListener(
              'click',
              function (event) {
                tarteaucitron.userInterface.openPanel()
                event.preventDefault()
              },
              false
            )
          }
        },
        true
      )
    },
    keydownEvent(isOldBrowser, evt) {
      if (evt.keyCode === 27) {
        tarteaucitron.userInterface.closePanel()
      }

      if (isOldBrowser) {
        if (evt.keyCode === 9 && focusableEls.includes(evt.target)) {
          if (evt.shiftKey) {
            /* shift + tab */ if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus()
              evt.preventDefault()
            }
          } /* tab */ else if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus()
            evt.preventDefault()
          }
        }
      }
    },
    hashchangeEvent() {
      if (
        document.location.hash === tarteaucitron.hashtag &&
        tarteaucitron.hashtag !== ''
      ) {
        tarteaucitron.userInterface.openPanel()
      }
    },
    resizeEvent() {
      const tacElem = document.getElementById('tarteaucitron')
      const tacCookieContainer = document.getElementById(
        'tarteaucitronCookiesListContainer'
      )

      if (tacElem && tacElem.style.display === 'block') {
        tarteaucitron.userInterface.jsSizing('main')
      }

      if (tacCookieContainer && tacCookieContainer.style.display === 'block') {
        tarteaucitron.userInterface.jsSizing('cookie')
      }
    },
    scrollEvent() {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop
      let heightPosition
      const tacPercentage = document.getElementById('tarteaucitronPercentage')
      const tacAlertBig = document.getElementById('tarteaucitronAlertBig')

      if (tacAlertBig && !tarteaucitron.highPrivacy) {
        if (tacAlertBig.style.display === 'block') {
          heightPosition = tacAlertBig.offsetHeight + 'px'

          if (scrollPos > screen.height * 2) {
            tarteaucitron.userInterface.respondAll(true)
          } else if (scrollPos > screen.height / 2) {
            document.getElementById('tarteaucitronDisclaimerAlert').innerHTML =
              '<strong>' +
              tarteaucitron.lang.alertBigScroll +
              '</strong> ' +
              tarteaucitron.lang.alertBig
          }

          if (tacPercentage) {
            if (tarteaucitron.orientation === 'top') {
              tacPercentage.style.top = heightPosition
            } else {
              tacPercentage.style.bottom = heightPosition
            }
            tacPercentage.style.width =
              (100 / (screen.height * 2)) * scrollPos + '%'
          }
        }
      }
    },
  },
  load() {
    'use strict'
    const cdn = tarteaucitron.cdn
    const language = tarteaucitron.getLanguage()
    const pathToLang =
      cdn + 'lang/tarteaucitron.' + language + '.js?v=' + tarteaucitron.version
    const pathToServices =
      cdn + 'tarteaucitron.services.js?v=' + tarteaucitron.version
    const linkElement = document.createElement('link')
    const defaults = {
      adblocker: false,
      hashtag: '#tarteaucitron',
      cookieName: 'tarteaucitron',
      highPrivacy: true,
      orientation: 'middle',
      bodyPosition: 'bottom',
      removeCredit: false,
      showAlertSmall: true,
      cookieslist: true,
      handleBrowserDNTRequest: false,
      DenyAllCta: true,
      AcceptAllCta: true,
      moreInfoLink: true,
      privacyUrl: '',
      useExternalCss: false,
      useExternalJs: false,
      mandatory: false,
    }
    const params = tarteaucitron.parameters

    // Don't show the middle bar if we are on the privacy policy or more page
    if (
      ((tarteaucitron.parameters.readmoreLink !== undefined &&
        window.location.href == tarteaucitron.parameters.readmoreLink) ||
        window.location.href == tarteaucitron.parameters.privacyUrl) &&
      tarteaucitron.parameters.orientation == 'middle'
    ) {
      tarteaucitron.parameters.orientation = 'bottom'
    }

    // Step -1
    if (typeof tarteaucitronCustomPremium !== 'undefined') {
      tarteaucitronCustomPremium()
    }

    // Step 0: get params
    if (params !== undefined) {
      for (const k in defaults) {
        if (!tarteaucitron.parameters.hasOwnProperty(k)) {
          tarteaucitron.parameters[k] = defaults[k]
        }
      }
    }

    // global
    tarteaucitron.orientation = tarteaucitron.parameters.orientation
    tarteaucitron.hashtag = tarteaucitron.parameters.hashtag
    tarteaucitron.highPrivacy = tarteaucitron.parameters.highPrivacy
    tarteaucitron.handleBrowserDNTRequest =
      tarteaucitron.parameters.handleBrowserDNTRequest

    // Step 1: load css
    if (!tarteaucitron.parameters.useExternalCss) {
      linkElement.rel = 'stylesheet'
      linkElement.type = 'text/css'
      linkElement.href =
        cdn + 'css/tarteaucitron.css?v=' + tarteaucitron.version
      document.getElementsByTagName('head')[0].appendChild(linkElement)
    }
    // Step 2: load language and services
    tarteaucitron.addInternalScript(pathToLang, '', function () {
      if (tarteaucitronCustomText !== '') {
        tarteaucitron.lang = tarteaucitron.AddOrUpdate(
          tarteaucitron.lang,
          tarteaucitronCustomText
        )
      }
      tarteaucitron.addInternalScript(pathToServices, '', function () {
        // css for new middle bar
        if (tarteaucitron.orientation === 'middle') {
          const customThemeMiddle = document.createElement('style')
          const cssRuleMiddle =
            "div#tarteaucitronRoot.tarteaucitronBeforeVisible:before {content: '';position: fixed;width: 100%;height: 100%;background: white;top: 0;left: 0;z-index: 999;opacity: 0.5;}div#tarteaucitronAlertBig:before {content: '" +
            tarteaucitron.lang.middleBarHead +
            "';font-size: 50px;}body #tarteaucitronRoot div#tarteaucitronAlertBig {width: 60%;min-width: 285px;height: auto;margin: auto;left: 50%;top: 50%;transform: translate(-50%, -50%);box-shadow: 0 0 9000px #000;border-radius: 20px;padding: 50px 0;}span#tarteaucitronDisclaimerAlert {padding: 0 30px;}#tarteaucitronRoot span#tarteaucitronDisclaimerAlert {margin: 50px 0;display: block;text-align: center;font-size: 21px;}"

          customThemeMiddle.type = 'text/css'
          if (customThemeMiddle.styleSheet) {
            customThemeMiddle.styleSheet.cssText = cssRuleMiddle
          } else {
            customThemeMiddle.appendChild(
              document.createTextNode(cssRuleMiddle)
            )
          }
          document
            .getElementsByTagName('head')[0]
            .appendChild(customThemeMiddle)
        }

        const body = document.body
        const div = document.createElement('div')
        let html = ''
        let index
        let orientation = 'Top'
        let cat = [
          'ads',
          'analytic',
          'api',
          'comment',
          'social',
          'support',
          'video',
          'other',
        ]
        let i

        cat = cat.sort(function (a, b) {
          if (tarteaucitron.lang[a].title > tarteaucitron.lang[b].title) {
            return 1
          }
          if (tarteaucitron.lang[a].title < tarteaucitron.lang[b].title) {
            return -1
          }
          return 0
        })

        // Step 3: prepare the html
        html += '<div id="tarteaucitronPremium"></div>'
        html +=
          '<button type="button" id="tarteaucitronBack" aria-label="' +
          tarteaucitron.lang.close +
          '"></button>'
        html +=
          '<div id="tarteaucitron" role="dialog" aria-labelledby="dialogTitle">'
        html += '   <button type="button" id="tarteaucitronClosePanel">'
        html += '       ' + tarteaucitron.lang.close
        html += '   </button>'
        html += '   <div id="tarteaucitronServices">'
        html +=
          '      <div class="tarteaucitronLine tarteaucitronMainLine" id="tarteaucitronMainLineOffset">'
        html +=
          '         <span class="tarteaucitronH1" role="heading" aria-level="1" id="dialogTitle">' +
          tarteaucitron.lang.title +
          '</span>'
        html += '         <div id="tarteaucitronInfo">'
        html += '         ' + tarteaucitron.lang.disclaimer
        if (tarteaucitron.parameters.privacyUrl !== '') {
          html += '   <br/><br/>'
          html += '   <button type="button" id="tarteaucitronPrivacyUrlDialog">'
          html += '       ' + tarteaucitron.lang.privacyUrl
          html += '   </button>'
        }
        html += '         </div>'
        html += '         <div class="tarteaucitronName">'
        html +=
          '            <span class="tarteaucitronH2" role="heading" aria-level="2">' +
          tarteaucitron.lang.all +
          '</span>'
        html += '         </div>'
        html +=
          '         <div class="tarteaucitronAsk" id="tarteaucitronScrollbarAdjust">'
        html +=
          '            <button type="button" id="tarteaucitronAllAllowed" class="tarteaucitronAllow">'
        html += '               &#10003; ' + tarteaucitron.lang.allowAll
        html += '            </button> '
        html +=
          '            <button type="button" id="tarteaucitronAllDenied" class="tarteaucitronDeny">'
        html += '               &#10007; ' + tarteaucitron.lang.denyAll
        html += '            </button>'
        html += '         </div>'
        html += '      </div>'
        html += '      <div class="tarteaucitronBorder">'
        html += '         <div class="clear"></div><ul>'

        if (tarteaucitron.parameters.mandatory == true) {
          html += '<li id="tarteaucitronServicesTitle_mandatory">'
          html += '<div class="tarteaucitronTitle">'
          html +=
            '   <button type="button">&nbsp; ' +
            tarteaucitron.lang.mandatoryTitle +
            '</button>'
          html += '</div>'
          html += '<ul id="tarteaucitronServices_mandatory">'
          html += '<li class="tarteaucitronLine">'
          html += '   <div class="tarteaucitronName">'
          html +=
            '       <span class="tarteaucitronH3" role="heading" aria-level="3">' +
            tarteaucitron.lang.mandatoryText +
            '</span>'
          html += '       <span class="tarteaucitronListCookies"></span><br/>'
          html += '   </div>'
          html += '   <div class="tarteaucitronAsk">'
          html += '       <button type="button" class="tarteaucitronAllow">'
          html += '           &#10003; ' + tarteaucitron.lang.allow
          html += '       </button> '
          html += '   </div>'
          html += '</li>'
          html += '</ul></li>'
        }

        for (i = 0; i < cat.length; i += 1) {
          html +=
            '         <li id="tarteaucitronServicesTitle_' +
            cat[i] +
            '" class="tarteaucitronHidden">'
          html += '            <div class="tarteaucitronTitle">'
          html +=
            '               <button type="button" class="catToggleBtn" data-cat="tarteaucitronDetails' +
            cat[i] +
            '">&#10011; ' +
            tarteaucitron.lang[cat[i]].title +
            '</button>'
          html += '            </div>'
          html +=
            '            <div id="tarteaucitronDetails' +
            cat[i] +
            '" class="tarteaucitronDetails tarteaucitronInfoBox">'
          html += '               ' + tarteaucitron.lang[cat[i]].details
          html += '            </div>'
          html +=
            '         <ul id="tarteaucitronServices_' + cat[i] + '"></ul></li>'
        }
        html +=
          '             <li id="tarteaucitronNoServicesTitle" class="tarteaucitronLine">' +
          tarteaucitron.lang.noServices +
          '</li>'
        html += '         </ul>'
        html +=
          '         <div class="tarteaucitronHidden spacer-20" id="tarteaucitronScrollbarChild"></div>'
        if (tarteaucitron.parameters.removeCredit === false) {
          html +=
            '     <a class="tarteaucitronSelfLink" href="https://tarteaucitron.io/" rel="nofollow noreferrer noopener" target="_blank" title="tarteaucitron ' +
            tarteaucitron.lang.newWindow +
            '">🍋 ' +
            tarteaucitron.lang.credit +
            '</a>'
        }
        html += '       </div>'
        html += '   </div>'
        html += '</div>'

        if (tarteaucitron.parameters.orientation === 'bottom') {
          orientation = 'Bottom'
        }

        if (
          tarteaucitron.parameters.highPrivacy &&
          !tarteaucitron.parameters.AcceptAllCta
        ) {
          html +=
            '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' +
            orientation +
            '">'
          // html += '<div class="tarteaucitronAlertBigWrapper">';
          html += '   <span id="tarteaucitronDisclaimerAlert">'
          html += '       ' + tarteaucitron.lang.alertBigPrivacy
          html += '   </span>'
          // html += '   <span class="tarteaucitronAlertBigBtnWrapper">';
          html += '   <button type="button" id="tarteaucitronPersonalize">'
          html += '       ' + tarteaucitron.lang.personalize
          html += '   </button>'

          if (tarteaucitron.parameters.privacyUrl !== '') {
            html += '   <button type="button" id="tarteaucitronPrivacyUrl">'
            html += '       ' + tarteaucitron.lang.privacyUrl
            html += '   </button>'
          }

          // html += '   </span>';
          // html += '</div>';
          html += '</div>'
        } else {
          html +=
            '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' +
            orientation +
            '">'
          // html += '<div class="tarteaucitronAlertBigWrapper">';
          html += '   <span id="tarteaucitronDisclaimerAlert">'

          if (tarteaucitron.parameters.highPrivacy) {
            html += '       ' + tarteaucitron.lang.alertBigPrivacy
          } else {
            html +=
              '       ' +
              tarteaucitron.lang.alertBigClick +
              ' ' +
              tarteaucitron.lang.alertBig
          }

          html += '   </span>'
          // html += '   <span class="tarteaucitronAlertBigBtnWrapper">';
          html += '   <button type="button" id="tarteaucitronPersonalize2">'
          html += '       &#10003; ' + tarteaucitron.lang.acceptAll
          html += '   </button>'

          if (tarteaucitron.parameters.DenyAllCta) {
            html +=
              '   <button type="button" class="tarteaucitronCTAButton tarteaucitronDeny" id="tarteaucitronAllDenied2">'
            html += '       &#10007; ' + tarteaucitron.lang.denyAll
            html += '   </button>'
            html += '   <br/><br/>'
          }

          html += '   <button type="button" id="tarteaucitronCloseAlert">'
          html += '       ' + tarteaucitron.lang.personalize
          html += '   </button>'

          if (tarteaucitron.parameters.privacyUrl !== '') {
            html += '   <button type="button" id="tarteaucitronPrivacyUrl">'
            html += '       ' + tarteaucitron.lang.privacyUrl
            html += '   </button>'
          }

          // html += '   </span>';
          // html += '</div>';
          html += '</div>'
          html += '<div id="tarteaucitronPercentage"></div>'
        }

        if (tarteaucitron.parameters.showAlertSmall === true) {
          html +=
            '<div id="tarteaucitronAlertSmall" class="tarteaucitronAlertSmall' +
            orientation +
            '">'
          html += '   <button type="button" id="tarteaucitronManager">'
          html += '       ' + tarteaucitron.lang.alertSmall
          html += '       <span id="tarteaucitronDot">'
          html += '           <span id="tarteaucitronDotGreen"></span>'
          html += '           <span id="tarteaucitronDotYellow"></span>'
          html += '           <span id="tarteaucitronDotRed"></span>'
          html += '       </span>'
          if (tarteaucitron.parameters.cookieslist === true) {
            html += '   </button><!-- @whitespace'
            html +=
              '   --><button type="button" id="tarteaucitronCookiesNumber">0</button>'
            html += '   <div id="tarteaucitronCookiesListContainer">'
            html +=
              '       <button type="button" id="tarteaucitronClosePanelCookie">'
            html += '           ' + tarteaucitron.lang.close
            html += '       </button>'
            html +=
              '       <div class="tarteaucitronCookiesListMain" id="tarteaucitronCookiesTitle">'
            html +=
              '            <span class="tarteaucitronH2" role="heading" aria-level="2" id="tarteaucitronCookiesNumberBis">0 cookie</span>'
            html += '       </div>'
            html += '       <div id="tarteaucitronCookiesList"></div>'
            html += '    </div>'
          } else {
            html += '   </div>'
          }
          html += '</div>'
        }

        tarteaucitron.addInternalScript(
          tarteaucitron.cdn + 'advertising.js?v=' + tarteaucitron.version,
          '',
          function () {
            if (
              tarteaucitronNoAdBlocker === true ||
              tarteaucitron.parameters.adblocker === false
            ) {
              // create a wrapper container at the same level than tarteaucitron so we can add an aria-hidden when tarteaucitron is opened
              /* var wrapper = document.createElement('div');
                        wrapper.id = "contentWrapper";

                        while (document.body.firstChild)
                        {
                            wrapper.appendChild(document.body.firstChild);
                        }

                        // Append the wrapper to the body
                        document.body.appendChild(wrapper); */

              div.id = 'tarteaucitronRoot'
              if (tarteaucitron.parameters.bodyPosition === 'top') {
                // Prepend tarteaucitron: #tarteaucitronRoot first-child of the body for better accessibility
                const bodyFirstChild = body.firstChild
                body.insertBefore(div, bodyFirstChild)
              } else {
                // Append tarteaucitron: #tarteaucitronRoot last-child of the body
                body.appendChild(div, body)
              }
              div.innerHTML = html

              // ie compatibility
              let tacRootAvailableEvent
              if (typeof Event === 'function') {
                tacRootAvailableEvent = new Event('tac.root_available')
              } else {
                tacRootAvailableEvent = document.createEvent('Event')
                tacRootAvailableEvent.initEvent(
                  'tac.root_available',
                  true,
                  true
                )
              }
              // end ie compatibility

              window.dispatchEvent(tacRootAvailableEvent)

              if (tarteaucitron.job !== undefined) {
                tarteaucitron.job = tarteaucitron.cleanArray(tarteaucitron.job)
                for (index = 0; index < tarteaucitron.job.length; index += 1) {
                  tarteaucitron.addService(tarteaucitron.job[index])
                }
              } else {
                tarteaucitron.job = []
              }

              tarteaucitron.isAjax = true

              tarteaucitron.job.push = function (id) {
                // ie <9 hack
                if (typeof tarteaucitron.job.indexOf === 'undefined') {
                  tarteaucitron.job.indexOf = function (obj, start) {
                    let i
                    const j = this.length
                    for (i = start || 0; i < j; i += 1) {
                      if (this[i] === obj) {
                        return i
                      }
                    }
                    return -1
                  }
                }

                if (!tarteaucitron.job.includes(id)) {
                  Array.prototype.push.call(this, id)
                }
                tarteaucitron.launch[id] = false
                tarteaucitron.addService(id)
              }

              if (
                document.location.hash === tarteaucitron.hashtag &&
                tarteaucitron.hashtag !== ''
              ) {
                tarteaucitron.userInterface.openPanel()
              }

              tarteaucitron.cookie.number()
              setInterval(tarteaucitron.cookie.number, 60000)
            }
          },
          tarteaucitron.parameters.adblocker
        )

        if (tarteaucitron.parameters.adblocker === true) {
          setTimeout(function () {
            if (tarteaucitronNoAdBlocker === false) {
              html =
                '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' +
                orientation +
                ' display-block" role="alert" aria-live="polite">'
              html += '   <p id="tarteaucitronDisclaimerAlert">'
              html += '       ' + tarteaucitron.lang.adblock + '<br/>'
              html +=
                '       <strong>' +
                tarteaucitron.lang.adblock_call +
                '</strong>'
              html += '   </p>'
              html +=
                '   <button type="button" class="tarteaucitronCTAButton" id="tarteaucitronCTAButton">'
              html += '       ' + tarteaucitron.lang.reload
              html += '   </button>'
              html += '</div>'
              html += '<div id="tarteaucitronPremium"></div>'

              div.id = 'tarteaucitronRoot'
              if (tarteaucitron.parameters.bodyPosition === 'top') {
                // Prepend tarteaucitron: #tarteaucitronRoot first-child of the body for better accessibility
                const bodyFirstChild = body.firstChild
                body.insertBefore(div, bodyFirstChild)
              } else {
                // Append tarteaucitron: #tarteaucitronRoot last-child of the body
                body.appendChild(div, body)
              }
              div.innerHTML = html
            }
          }, 1500)
        }

        // Setup events
        tarteaucitron.addClickEventToId(
          'tarteaucitronPersonalize',
          function () {
            tarteaucitron.userInterface.openPanel()
          }
        )
        tarteaucitron.addClickEventToId(
          'tarteaucitronPersonalize2',
          function () {
            tarteaucitron.userInterface.respondAll(true)
          }
        )
        tarteaucitron.addClickEventToId('tarteaucitronManager', function () {
          tarteaucitron.userInterface.openPanel()
        })
        tarteaucitron.addClickEventToId('tarteaucitronBack', function () {
          tarteaucitron.userInterface.closePanel()
        })
        tarteaucitron.addClickEventToId('tarteaucitronClosePanel', function () {
          tarteaucitron.userInterface.closePanel()
        })
        tarteaucitron.addClickEventToId(
          'tarteaucitronClosePanelCookie',
          function () {
            tarteaucitron.userInterface.closePanel()
          }
        )
        tarteaucitron.addClickEventToId('tarteaucitronPrivacyUrl', function () {
          document.location = tarteaucitron.parameters.privacyUrl
        })
        tarteaucitron.addClickEventToId(
          'tarteaucitronPrivacyUrlDialog',
          function () {
            document.location = tarteaucitron.parameters.privacyUrl
          }
        )
        tarteaucitron.addClickEventToId(
          'tarteaucitronCookiesNumber',
          function () {
            tarteaucitron.userInterface.toggleCookiesList()
          }
        )
        tarteaucitron.addClickEventToId('tarteaucitronAllAllowed', function () {
          tarteaucitron.userInterface.respondAll(true)
        })
        tarteaucitron.addClickEventToId('tarteaucitronAllDenied', function () {
          tarteaucitron.userInterface.respondAll(false)
        })
        tarteaucitron.addClickEventToId('tarteaucitronAllDenied2', function () {
          tarteaucitron.userInterface.respondAll(false)
        })
        tarteaucitron.addClickEventToId('tarteaucitronCloseAlert', function () {
          tarteaucitron.userInterface.openPanel()
        })
        tarteaucitron.addClickEventToId('tarteaucitronCTAButton', function () {
          location.reload()
        })
        const toggleBtns = document.getElementsByClassName('catToggleBtn')
        for (let i = 0; i < toggleBtns.length; i++) {
          tarteaucitron.addClickEventToElement(toggleBtns[i], function () {
            tarteaucitron.userInterface.toggle(
              'tarteaucitronDetails' + cat[i],
              'tarteaucitronInfoBox'
            )
            return false
          })
        }
        const allowBtns = document.getElementsByClassName('tarteaucitronAllow')
        for (let i = 0; i < allowBtns.length; i++) {
          tarteaucitron.addClickEventToElement(allowBtns[i], function () {
            tarteaucitron.userInterface.respond(this, true)
          })
        }
        const denyBtns = document.getElementsByClassName('tarteaucitronDeny')
        for (let i = 0; i < denyBtns.length; i++) {
          tarteaucitron.addClickEventToElement(denyBtns[i], function () {
            tarteaucitron.userInterface.respond(this, false)
          })
        }
      })
    })

    if (tarteaucitron.events.load) {
      tarteaucitron.events.load()
    }
  },
  addService(serviceId) {
    'use strict'
    let html = ''
    const s = tarteaucitron.services
    const service = s[serviceId]
    const cookie = tarteaucitron.cookie.read()
    const hostname = document.location.hostname
    const hostRef = document.referrer.split('/')[2]
    const isNavigating =
      hostRef === hostname &&
      window.location.href !== tarteaucitron.parameters.privacyUrl
    const isAutostart = !service.needConsent
    const isWaiting = cookie.includes(service.key + '=wait')
    const isDenied = cookie.includes(service.key + '=false')
    let isAllowed =
      cookie.includes(service.key + '=true') ||
      (!service.needConsent && !cookie.includes(service.key + '=false'))
    const isResponded =
      cookie.includes(service.key + '=false') ||
      cookie.includes(service.key + '=true')
    const isDNTRequested =
      navigator.doNotTrack === '1' ||
      navigator.doNotTrack === 'yes' ||
      navigator.msDoNotTrack === '1' ||
      window.doNotTrack === '1'

    if (tarteaucitron.added[service.key] !== true) {
      tarteaucitron.added[service.key] = true

      html += '<li id="' + service.key + 'Line" class="tarteaucitronLine">'
      html += '   <div class="tarteaucitronName">'
      html +=
        '       <span class="tarteaucitronH3" role="heading" aria-level="3">' +
        service.name +
        '</span>'
      html +=
        '       <span id="tacCL' +
        service.key +
        '" class="tarteaucitronListCookies"></span><br/>'

      if (tarteaucitron.parameters.moreInfoLink == true) {
        let link = 'https://tarteaucitron.io/service/' + service.key + '/'
        if (service.readmoreLink !== undefined && service.readmoreLink !== '') {
          link = service.readmoreLink
        }
        if (
          tarteaucitron.parameters.readmoreLink !== undefined &&
          tarteaucitron.parameters.readmoreLink !== ''
        ) {
          link = tarteaucitron.parameters.readmoreLink
        }
        html +=
          '       <a href="' +
          link +
          '" target="_blank" rel="noreferrer noopener" title="' +
          tarteaucitron.lang.cookieDetail +
          ' ' +
          service.name +
          ' ' +
          tarteaucitron.lang.ourSite +
          ' ' +
          tarteaucitron.lang.newWindow +
          '">'
        html += '           ' + tarteaucitron.lang.more
        html += '       </a>'
        html += '        - '
        html +=
          '       <a href="' +
          service.uri +
          '" target="_blank" rel="noreferrer noopener" title="' +
          service.name +
          ' ' +
          tarteaucitron.lang.newWindow +
          '">'
        html += '           ' + tarteaucitron.lang.source
        html += '       </a>'
      }

      html += '   </div>'
      html += '   <div class="tarteaucitronAsk">'
      html +=
        '       <button type="button" id="' +
        service.key +
        'Allowed" class="tarteaucitronAllow">'
      html += '           &#10003; ' + tarteaucitron.lang.allow
      html += '       </button> '
      html +=
        '       <button type="button" id="' +
        service.key +
        'Denied" class="tarteaucitronDeny">'
      html += '           &#10007; ' + tarteaucitron.lang.deny
      html += '       </button>'
      html += '   </div>'
      html += '</li>'

      tarteaucitron.userInterface.css(
        'tarteaucitronServicesTitle_' + service.type,
        'display',
        'block'
      )

      if (
        document.getElementById('tarteaucitronServices_' + service.type) !==
        null
      ) {
        document.getElementById(
          'tarteaucitronServices_' + service.type
        ).innerHTML += html
      }

      tarteaucitron.userInterface.css(
        'tarteaucitronNoServicesTitle',
        'display',
        'none'
      )

      tarteaucitron.userInterface.order(service.type)
    }

    tarteaucitron.pro('!' + service.key + '=' + isAllowed)

    // allow by default for non EU
    if (isResponded === false && tarteaucitron.user.bypass === true) {
      isAllowed = true
      tarteaucitron.cookie.create(service.key, true)
    }

    if (
      (!isResponded &&
        (isAutostart || (isNavigating && isWaiting)) &&
        !tarteaucitron.highPrivacy) ||
      isAllowed
    ) {
      if (!isAllowed) {
        tarteaucitron.cookie.create(service.key, true)
      }
      if (tarteaucitron.launch[service.key] !== true) {
        tarteaucitron.launch[service.key] = true
        service.js()
        tarteaucitron.sendEvent(service.key + '_loaded')
      }
      tarteaucitron.state[service.key] = true
      tarteaucitron.userInterface.color(service.key, true)
    } else if (isDenied) {
      if (typeof service.fallback === 'function') {
        service.fallback()
      }
      tarteaucitron.state[service.key] = false
      tarteaucitron.userInterface.color(service.key, false)
    } else if (
      !isResponded &&
      isDNTRequested &&
      tarteaucitron.handleBrowserDNTRequest
    ) {
      tarteaucitron.cookie.create(service.key, 'false')
      if (typeof service.fallback === 'function') {
        service.fallback()
      }
      tarteaucitron.state[service.key] = false
      tarteaucitron.userInterface.color(service.key, false)
    } else if (!isResponded) {
      tarteaucitron.cookie.create(service.key, 'wait')
      if (typeof service.fallback === 'function') {
        service.fallback()
      }
      tarteaucitron.userInterface.color(service.key, 'wait')
      tarteaucitron.userInterface.openAlert()
    }

    tarteaucitron.cookie.checkCount(service.key)
    tarteaucitron.sendEvent(service.key + '_added')
  },
  sendEvent(event_key) {
    if (event_key !== undefined) {
      // ie compatibility
      let send_event_item
      if (typeof Event === 'function') {
        send_event_item = new Event(event_key)
      } else {
        send_event_item = document.createEvent('Event')
        send_event_item.initEvent(event_key, true, true)
      }
      // end ie compatibility

      document.dispatchEvent(send_event_item)
    }
  },
  cleanArray: function cleanArray(arr) {
    'use strict'
    let i
    const len = arr.length
    let out = []
    const obj = {}
    const s = tarteaucitron.services

    for (i = 0; i < len; i += 1) {
      if (!obj[arr[i]]) {
        obj[arr[i]] = {}
        if (tarteaucitron.services[arr[i]] !== undefined) {
          out.push(arr[i])
        }
      }
    }

    out = out.sort(function (a, b) {
      if (s[a].type + s[a].key > s[b].type + s[b].key) {
        return 1
      }
      if (s[a].type + s[a].key < s[b].type + s[b].key) {
        return -1
      }
      return 0
    })

    return out
  },
  userInterface: {
    css(id, property, value) {
      'use strict'
      if (document.getElementById(id) !== null) {
        document.getElementById(id).style[property] = value
      }
    },
    addClass(id, className) {
      'use strict'
      if (document.getElementById(id) !== null) {
        document.getElementById(id).classList.add(className)
      }
    },
    removeClass(id, className) {
      'use strict'
      if (document.getElementById(id) !== null) {
        document.getElementById(id).classList.remove(className)
      }
    },
    respondAll(status) {
      'use strict'
      const s = tarteaucitron.services
      let service
      let key
      let index = 0

      for (index = 0; index < tarteaucitron.job.length; index += 1) {
        service = s[tarteaucitron.job[index]]
        key = service.key
        if (tarteaucitron.state[key] !== status) {
          if (status === false && tarteaucitron.launch[key] === true) {
            tarteaucitron.reloadThePage = true
          }
          if (tarteaucitron.launch[key] !== true && status === true) {
            tarteaucitron.pro('!' + key + '=engage')

            tarteaucitron.launch[key] = true
            tarteaucitron.services[key].js()
          }
          tarteaucitron.state[key] = status
          tarteaucitron.cookie.create(key, status)
          tarteaucitron.userInterface.color(key, status)
        }
      }
    },
    respond(el, status) {
      'use strict'
      const key = el.id.replace(new RegExp('(Eng[0-9]+|Allow|Deni)ed', 'g'), '')

      // return if same state
      if (tarteaucitron.state[key] === status) {
        return
      }

      if (status === false && tarteaucitron.launch[key] === true) {
        tarteaucitron.reloadThePage = true
      }

      // if not already launched... launch the service
      if (status === true) {
        if (tarteaucitron.launch[key] !== true) {
          tarteaucitron.pro('!' + key + '=engage')

          tarteaucitron.launch[key] = true
          tarteaucitron.sendEvent(key + '_loaded')
          tarteaucitron.services[key].js()
        }
      }
      tarteaucitron.state[key] = status
      tarteaucitron.cookie.create(key, status)
      tarteaucitron.userInterface.color(key, status)
    },
    color(key, status) {
      'use strict'
      const c = 'tarteaucitron'
      let nbDenied = 0
      let nbPending = 0
      let nbAllowed = 0
      const sum = tarteaucitron.job.length
      let index

      if (status === true) {
        document
          .getElementById(key + 'Line')
          .classList.add('tarteaucitronIsAllowed')
        document
          .getElementById(key + 'Line')
          .classList.remove('tarteaucitronIsDenied')
      } else if (status === false) {
        document
          .getElementById(key + 'Line')
          .classList.remove('tarteaucitronIsAllowed')
        document
          .getElementById(key + 'Line')
          .classList.add('tarteaucitronIsDenied')
      }

      // check if all services are allowed
      for (index = 0; index < sum; index += 1) {
        if (tarteaucitron.state[tarteaucitron.job[index]] === false) {
          nbDenied += 1
        } else if (
          tarteaucitron.state[tarteaucitron.job[index]] === undefined
        ) {
          nbPending += 1
        } else if (tarteaucitron.state[tarteaucitron.job[index]] === true) {
          nbAllowed += 1
        }
      }

      tarteaucitron.userInterface.css(
        c + 'DotGreen',
        'width',
        (100 / sum) * nbAllowed + '%'
      )
      tarteaucitron.userInterface.css(
        c + 'DotYellow',
        'width',
        (100 / sum) * nbPending + '%'
      )
      tarteaucitron.userInterface.css(
        c + 'DotRed',
        'width',
        (100 / sum) * nbDenied + '%'
      )

      if (nbDenied === 0 && nbPending === 0) {
        tarteaucitron.userInterface.removeClass(
          c + 'AllDenied',
          c + 'IsSelected'
        )
        tarteaucitron.userInterface.addClass(c + 'AllAllowed', c + 'IsSelected')

        tarteaucitron.userInterface.addClass(
          c + 'MainLineOffset',
          c + 'IsAllowed'
        )
        tarteaucitron.userInterface.removeClass(
          c + 'MainLineOffset',
          c + 'IsDenied'
        )
      } else if (nbAllowed === 0 && nbPending === 0) {
        tarteaucitron.userInterface.removeClass(
          c + 'AllAllowed',
          c + 'IsSelected'
        )
        tarteaucitron.userInterface.addClass(c + 'AllDenied', c + 'IsSelected')

        tarteaucitron.userInterface.removeClass(
          c + 'MainLineOffset',
          c + 'IsAllowed'
        )
        tarteaucitron.userInterface.addClass(
          c + 'MainLineOffset',
          c + 'IsDenied'
        )
      } else {
        tarteaucitron.userInterface.removeClass(
          c + 'AllAllowed',
          c + 'IsSelected'
        )
        tarteaucitron.userInterface.removeClass(
          c + 'AllDenied',
          c + 'IsSelected'
        )

        tarteaucitron.userInterface.removeClass(
          c + 'MainLineOffset',
          c + 'IsAllowed'
        )
        tarteaucitron.userInterface.removeClass(
          c + 'MainLineOffset',
          c + 'IsDenied'
        )
      }

      // close the alert if all service have been reviewed
      if (nbPending === 0) {
        tarteaucitron.userInterface.closeAlert()
      }

      if (tarteaucitron.services[key].cookies.length > 0 && status === false) {
        tarteaucitron.cookie.purge(tarteaucitron.services[key].cookies)
      }

      if (status === true) {
        if (document.getElementById('tacCL' + key) !== null) {
          document.getElementById('tacCL' + key).innerHTML = '...'
        }
        setTimeout(function () {
          tarteaucitron.cookie.checkCount(key)
        }, 2500)
      } else {
        tarteaucitron.cookie.checkCount(key)
      }
    },
    openPanel() {
      'use strict'

      tarteaucitron.userInterface.css('tarteaucitron', 'display', 'block')
      tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'block')
      tarteaucitron.userInterface.css(
        'tarteaucitronCookiesListContainer',
        'display',
        'none'
      )

      document.getElementById('tarteaucitronClosePanel').focus()
      document.getElementsByTagName('body')[0].classList.add('modal-open')
      tarteaucitron.userInterface.focusTrap()
      tarteaucitron.userInterface.jsSizing('main')

      // ie compatibility
      let tacOpenPanelEvent
      if (typeof Event === 'function') {
        tacOpenPanelEvent = new Event('tac.open_panel')
      } else {
        tacOpenPanelEvent = document.createEvent('Event')
        tacOpenPanelEvent.initEvent('tac.open_panel', true, true)
      }
      // end ie compatibility

      window.dispatchEvent(tacOpenPanelEvent)
    },
    closePanel() {
      'use strict'

      if (document.location.hash === tarteaucitron.hashtag) {
        if (window.history) {
          window.history.replaceState(
            '',
            document.title,
            window.location.pathname + window.location.search
          )
        } else {
          document.location.hash = ''
        }
      }
      tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none')
      tarteaucitron.userInterface.css(
        'tarteaucitronCookiesListContainer',
        'display',
        'none'
      )

      tarteaucitron.fallback(
        ['tarteaucitronInfoBox'],
        function (elem) {
          elem.style.display = 'none'
        },
        true
      )

      if (tarteaucitron.reloadThePage === true) {
        window.location.reload()
      } else {
        tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'none')
      }
      if (document.getElementById('tarteaucitronCloseAlert') !== null) {
        document.getElementById('tarteaucitronCloseAlert').focus()
      }
      document.getElementsByTagName('body')[0].classList.remove('modal-open')

      // ie compatibility
      let tacClosePanelEvent
      if (typeof Event === 'function') {
        tacClosePanelEvent = new Event('tac.close_panel')
      } else {
        tacClosePanelEvent = document.createEvent('Event')
        tacClosePanelEvent.initEvent('tac.close_panel', true, true)
      }
      // end ie compatibility

      window.dispatchEvent(tacClosePanelEvent)
    },
    focusTrap() {
      'use strict'

      let focusableEls, firstFocusableEl, lastFocusableEl, filtered

      focusableEls = document
        .getElementById('tarteaucitron')
        .querySelectorAll('a[href], button')
      filtered = []

      // get only visible items
      for (let i = 0, max = focusableEls.length; i < max; i++) {
        if (focusableEls[i].offsetHeight > 0) {
          filtered.push(focusableEls[i])
        }
      }

      firstFocusableEl = filtered[0]
      lastFocusableEl = filtered[filtered.length - 1]

      // loop focus inside tarteaucitron
      document
        .getElementById('tarteaucitron')
        .addEventListener('keydown', function (evt) {
          if (evt.key === 'Tab' || evt.keyCode === 9) {
            if (evt.shiftKey) {
              /* shift + tab */ if (
                document.activeElement === firstFocusableEl
              ) {
                lastFocusableEl.focus()
                evt.preventDefault()
              }
            } /* tab */ else if (document.activeElement === lastFocusableEl) {
              firstFocusableEl.focus()
              evt.preventDefault()
            }
          }
        })
    },
    openAlert() {
      'use strict'
      const c = 'tarteaucitron'
      tarteaucitron.userInterface.css(c + 'Percentage', 'display', 'block')
      tarteaucitron.userInterface.css(c + 'AlertSmall', 'display', 'none')
      tarteaucitron.userInterface.css(c + 'AlertBig', 'display', 'block')
      tarteaucitron.userInterface.addClass(
        c + 'Root',
        'tarteaucitronBeforeVisible'
      )

      // ie compatibility
      let tacOpenAlertEvent
      if (typeof Event === 'function') {
        tacOpenAlertEvent = new Event('tac.open_alert')
      } else {
        tacOpenAlertEvent = document.createEvent('Event')
        tacOpenAlertEvent.initEvent('tac.open_alert', true, true)
      }
      // end ie compatibility

      window.dispatchEvent(tacOpenAlertEvent)
    },
    closeAlert() {
      'use strict'
      const c = 'tarteaucitron'
      tarteaucitron.userInterface.css(c + 'Percentage', 'display', 'none')
      tarteaucitron.userInterface.css(c + 'AlertSmall', 'display', 'block')
      tarteaucitron.userInterface.css(c + 'AlertBig', 'display', 'none')
      tarteaucitron.userInterface.removeClass(
        c + 'Root',
        'tarteaucitronBeforeVisible'
      )
      tarteaucitron.userInterface.jsSizing('box')

      // ie compatibility
      let tacCloseAlertEvent
      if (typeof Event === 'function') {
        tacCloseAlertEvent = new Event('tac.close_alert')
      } else {
        tacCloseAlertEvent = document.createEvent('Event')
        tacCloseAlertEvent.initEvent('tac.close_alert', true, true)
      }
      // end ie compatibility

      window.dispatchEvent(tacCloseAlertEvent)
    },
    toggleCookiesList() {
      'use strict'
      const div = document.getElementById('tarteaucitronCookiesListContainer')

      if (div === null) {
        return
      }

      if (div.style.display !== 'block') {
        tarteaucitron.cookie.number()
        div.style.display = 'block'
        tarteaucitron.userInterface.jsSizing('cookie')
        tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none')
        tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'block')
        tarteaucitron.fallback(
          ['tarteaucitronInfoBox'],
          function (elem) {
            elem.style.display = 'none'
          },
          true
        )
      } else {
        div.style.display = 'none'
        tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none')
        tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'none')
      }
    },
    toggle(id, closeClass) {
      'use strict'
      const div = document.getElementById(id)

      if (div === null) {
        return
      }

      if (closeClass !== undefined) {
        tarteaucitron.fallback(
          [closeClass],
          function (elem) {
            if (elem.id !== id) {
              elem.style.display = 'none'
            }
          },
          true
        )
      }

      if (div.style.display !== 'block') {
        div.style.display = 'block'
      } else {
        div.style.display = 'none'
      }
    },
    order(id) {
      'use strict'
      const main = document.getElementById('tarteaucitronServices_' + id)
      let allDivs
      const store = []
      let i

      if (main === null) {
        return
      }

      allDivs = main.childNodes

      if (
        typeof Array.prototype.map === 'function' &&
        typeof Enumerable === 'undefined'
      ) {
        Array.prototype.map
          .call(main.children, Object)
          .sort(function (a, b) {
            // var mainChildren = Array.from(main.children);
            // mainChildren.sort(function (a, b) {
            if (
              tarteaucitron.services[a.id.replace(/Line/g, '')].name >
              tarteaucitron.services[b.id.replace(/Line/g, '')].name
            ) {
              return 1
            }
            if (
              tarteaucitron.services[a.id.replace(/Line/g, '')].name <
              tarteaucitron.services[b.id.replace(/Line/g, '')].name
            ) {
              return -1
            }
            return 0
          })
          .forEach(function (element) {
            main.appendChild(element)
          })
      }
    },
    jsSizing(type) {
      'use strict'
      let scrollbarMarginRight = 10
      let scrollbarWidthParent
      let scrollbarWidthChild
      let servicesHeight
      let e = window
      let a = 'inner'
      const windowInnerHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      let mainTop
      let mainHeight
      let closeButtonHeight
      let headerHeight
      let cookiesListHeight
      let cookiesCloseHeight
      let cookiesTitleHeight
      let paddingBox
      let alertSmallHeight
      let cookiesNumberHeight

      if (type === 'box') {
        if (
          document.getElementById('tarteaucitronAlertSmall') !== null &&
          document.getElementById('tarteaucitronCookiesNumber') !== null
        ) {
          // reset
          tarteaucitron.userInterface.css(
            'tarteaucitronCookiesNumber',
            'padding',
            '0px 10px'
          )

          // calculate
          alertSmallHeight = document.getElementById('tarteaucitronAlertSmall')
            .offsetHeight
          cookiesNumberHeight = document.getElementById(
            'tarteaucitronCookiesNumber'
          ).offsetHeight
          paddingBox = (alertSmallHeight - cookiesNumberHeight) / 2

          // apply
          tarteaucitron.userInterface.css(
            'tarteaucitronCookiesNumber',
            'padding',
            paddingBox + 'px 10px'
          )
        }
      } else if (type === 'main') {
        // get the real window width for media query
        if (window.innerWidth === undefined) {
          a = 'client'
          e = document.documentElement || document.body
        }

        // height of the services list container
        if (
          document.getElementById('tarteaucitron') !== null &&
          document.getElementById('tarteaucitronClosePanel') !== null &&
          document.getElementById('tarteaucitronMainLineOffset') !== null
        ) {
          // reset
          tarteaucitron.userInterface.css(
            'tarteaucitronServices',
            'height',
            'auto'
          )

          // calculate
          mainHeight = document.getElementById('tarteaucitron').offsetHeight
          closeButtonHeight = document.getElementById('tarteaucitronClosePanel')
            .offsetHeight

          // apply
          servicesHeight = mainHeight - closeButtonHeight + 2
          tarteaucitron.userInterface.css(
            'tarteaucitronServices',
            'height',
            servicesHeight + 'px'
          )
          tarteaucitron.userInterface.css(
            'tarteaucitronServices',
            'overflow-x',
            'auto'
          )
        }

        // align the main allow/deny button depending on scrollbar width
        if (
          document.getElementById('tarteaucitronServices') !== null &&
          document.getElementById('tarteaucitronScrollbarChild') !== null
        ) {
          // media query
          if (e[a + 'Width'] <= 479) {
            tarteaucitron.userInterface.css(
              'tarteaucitronScrollbarAdjust',
              'marginLeft',
              '11px'
            )
          } else if (e[a + 'Width'] <= 767) {
            scrollbarMarginRight = 12
          }

          scrollbarWidthParent = document.getElementById(
            'tarteaucitronServices'
          ).offsetWidth
          scrollbarWidthChild = document.getElementById(
            'tarteaucitronScrollbarChild'
          ).offsetWidth
          tarteaucitron.userInterface.css(
            'tarteaucitronScrollbarAdjust',
            'marginRight',
            scrollbarWidthParent -
              scrollbarWidthChild +
              scrollbarMarginRight +
              'px'
          )
        }

        // center the main panel
        if (document.getElementById('tarteaucitron') !== null) {
          // media query
          if (e[a + 'Width'] <= 767) {
            mainTop = 0
          } else {
            mainTop =
              (windowInnerHeight -
                document.getElementById('tarteaucitron').offsetHeight) /
                2 -
              21
          }

          if (document.getElementById('tarteaucitronMainLineOffset') !== null) {
            if (
              document.getElementById('tarteaucitron').offsetHeight <
              windowInnerHeight / 2
            ) {
              mainTop -= document.getElementById('tarteaucitronMainLineOffset')
                .offsetHeight
            }
          }

          // correct
          if (mainTop < 0) {
            mainTop = 0
          }

          // apply
          tarteaucitron.userInterface.css(
            'tarteaucitron',
            'top',
            mainTop + 'px'
          )
        }
      } else if (type === 'cookie') {
        // put cookies list at bottom
        if (document.getElementById('tarteaucitronAlertSmall') !== null) {
          tarteaucitron.userInterface.css(
            'tarteaucitronCookiesListContainer',
            'bottom',
            document.getElementById('tarteaucitronAlertSmall').offsetHeight +
              'px'
          )
        }

        // height of cookies list
        if (
          document.getElementById('tarteaucitronCookiesListContainer') !== null
        ) {
          // reset
          tarteaucitron.userInterface.css(
            'tarteaucitronCookiesList',
            'height',
            'auto'
          )

          // calculate
          cookiesListHeight = document.getElementById(
            'tarteaucitronCookiesListContainer'
          ).offsetHeight
          cookiesCloseHeight = document.getElementById(
            'tarteaucitronClosePanelCookie'
          ).offsetHeight
          cookiesTitleHeight = document.getElementById(
            'tarteaucitronCookiesTitle'
          ).offsetHeight

          // apply
          tarteaucitron.userInterface.css(
            'tarteaucitronCookiesList',
            'height',
            cookiesListHeight -
              cookiesCloseHeight -
              cookiesTitleHeight -
              2 +
              'px'
          )
        }
      }
    },
  },
  cookie: {
    owner: {},
    create(key, status) {
      'use strict'

      if (tarteaucitronForceExpire !== '') {
        // The number of day(s)/hour(s) can't be higher than 1 year
        if (
          (tarteaucitronExpireInDay && tarteaucitronForceExpire < 365) ||
          (!tarteaucitronExpireInDay && tarteaucitronForceExpire < 8760)
        ) {
          if (tarteaucitronExpireInDay) {
            // Multiplication to tranform the number of days to milliseconds
            timeExpire = tarteaucitronForceExpire * 86400000
          } else {
            // Multiplication to tranform the number of hours to milliseconds
            timeExpire = tarteaucitronForceExpire * 3600000
          }
        }
      }

      const d = new Date()
      const time = d.getTime()
      const expireTime = time + timeExpire // 365 days
      const regex = new RegExp('!' + key + '=(wait|true|false)', 'g')
      const cookie = tarteaucitron.cookie.read().replace(regex, '')
      const value =
        tarteaucitron.parameters.cookieName +
        '=' +
        cookie +
        '!' +
        key +
        '=' +
        status
      const domain =
        tarteaucitron.parameters.cookieDomain !== undefined &&
        tarteaucitron.parameters.cookieDomain !== ''
          ? '; domain=' + tarteaucitron.parameters.cookieDomain
          : ''
      const secure = location.protocol === 'https:' ? '; Secure' : ''

      d.setTime(expireTime)
      document.cookie =
        value +
        '; expires=' +
        d.toGMTString() +
        '; path=/' +
        domain +
        secure +
        '; samesite=lax'
    },
    read() {
      'use strict'
      const nameEQ = tarteaucitron.parameters.cookieName + '='
      const ca = document.cookie.split(';')
      let i
      let c

      for (i = 0; i < ca.length; i += 1) {
        c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length)
        }
      }
      return ''
    },
    purge(arr) {
      'use strict'
      let i

      for (i = 0; i < arr.length; i += 1) {
        document.cookie =
          arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;'
        document.cookie =
          arr[i] +
          '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' +
          location.hostname +
          ';'
        document.cookie =
          arr[i] +
          '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' +
          location.hostname.split('.').slice(-2).join('.') +
          ';'
      }
    },
    checkCount(key) {
      'use strict'
      const arr = tarteaucitron.services[key].cookies
      const nb = arr.length
      let nbCurrent = 0
      let html = ''
      let i
      const status = document.cookie.indexOf(key + '=true')

      if (status >= 0 && nb === 0) {
        html += tarteaucitron.lang.useNoCookie
      } else if (status >= 0) {
        for (i = 0; i < nb; i += 1) {
          if (document.cookie.includes(arr[i] + '=')) {
            nbCurrent += 1
            if (tarteaucitron.cookie.owner[arr[i]] === undefined) {
              tarteaucitron.cookie.owner[arr[i]] = []
            }
            if (
              tarteaucitron.cookie.crossIndexOf(
                tarteaucitron.cookie.owner[arr[i]],
                tarteaucitron.services[key].name
              ) === false
            ) {
              tarteaucitron.cookie.owner[arr[i]].push(
                tarteaucitron.services[key].name
              )
            }
          }
        }

        if (nbCurrent > 0) {
          html +=
            tarteaucitron.lang.useCookieCurrent + ' ' + nbCurrent + ' cookie'
          if (nbCurrent > 1) {
            html += 's'
          }
          html += '.'
        } else {
          html += tarteaucitron.lang.useNoCookie
        }
      } else if (nb === 0) {
        html = tarteaucitron.lang.noCookie
      } else {
        html += tarteaucitron.lang.useCookie + ' ' + nb + ' cookie'
        if (nb > 1) {
          html += 's'
        }
        html += '.'
      }

      if (document.getElementById('tacCL' + key) !== null) {
        document.getElementById('tacCL' + key).innerHTML = html
      }
    },
    crossIndexOf(arr, match) {
      'use strict'
      let i
      for (i = 0; i < arr.length; i += 1) {
        if (arr[i] === match) {
          return true
        }
      }
      return false
    },
    number() {
      'use strict'
      let cookies = document.cookie.split(';')
      const nb = document.cookie !== '' ? cookies.length : 0
      let html = ''
      let i
      let name
      let namea
      let nameb
      let c
      let d
      const s = nb > 1 ? 's' : ''
      let savedname
      const regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i
      const regexedDomain =
        tarteaucitron.cdn.match(regex) !== null
          ? tarteaucitron.cdn.match(regex)[1]
          : tarteaucitron.cdn
      const host =
        tarteaucitron.domain !== undefined
          ? tarteaucitron.domain
          : regexedDomain

      cookies = cookies.sort(function (a, b) {
        namea = a.split('=', 1).toString().replace(/ /g, '')
        nameb = b.split('=', 1).toString().replace(/ /g, '')
        c =
          tarteaucitron.cookie.owner[namea] !== undefined
            ? tarteaucitron.cookie.owner[namea]
            : '0'
        d =
          tarteaucitron.cookie.owner[nameb] !== undefined
            ? tarteaucitron.cookie.owner[nameb]
            : '0'
        if (c + a > d + b) {
          return 1
        }
        if (c + a < d + b) {
          return -1
        }
        return 0
      })

      if (document.cookie !== '') {
        for (i = 0; i < nb; i += 1) {
          name = cookies[i].split('=', 1).toString().replace(/ /g, '')
          if (
            tarteaucitron.cookie.owner[name] !== undefined &&
            tarteaucitron.cookie.owner[name].join(' // ') !== savedname
          ) {
            savedname = tarteaucitron.cookie.owner[name].join(' // ')
            html += '<div class="tarteaucitronHidden">'
            html +=
              '     <span class="tarteaucitronTitle tarteaucitronH3" role="heading" aria-level="3">'
            html += '        ' + tarteaucitron.cookie.owner[name].join(' // ')
            html += '    </span>'
            html += '</div><ul class="cookie-list">'
          } else if (
            tarteaucitron.cookie.owner[name] === undefined &&
            host !== savedname
          ) {
            savedname = host
            html += '<div class="tarteaucitronHidden">'
            html +=
              '     <span class="tarteaucitronTitle tarteaucitronH3" role="heading" aria-level="3">'
            html += '        ' + host
            html += '    </span>'
            html += '</div><ul class="cookie-list">'
          }
          html += '<li class="tarteaucitronCookiesListMain">'
          html +=
            '    <div class="tarteaucitronCookiesListLeft"><button type="button" class="purgeBtn" data-cookie="' +
            tarteaucitron.fixSelfXSS(cookies[i].split('=', 1)) +
            '"><strong>&times;</strong></button> <strong>' +
            tarteaucitron.fixSelfXSS(name) +
            '</strong>'
          html += '    </div>'
          html +=
            '    <div class="tarteaucitronCookiesListRight">' +
            tarteaucitron.fixSelfXSS(cookies[i].split('=').slice(1).join('=')) +
            '</div>'
          html += '</li>'
        }
        html += '</ul>'
      } else {
        html += '<div class="tarteaucitronCookiesListMain">'
        html +=
          '    <div class="tarteaucitronCookiesListLeft"><strong>-</strong></div>'
        html += '    <div class="tarteaucitronCookiesListRight"></div>'
        html += '</div>'
      }

      html += '<div class="tarteaucitronHidden spacer-20"></div>'

      if (document.getElementById('tarteaucitronCookiesList') !== null) {
        document.getElementById('tarteaucitronCookiesList').innerHTML = html
      }

      if (document.getElementById('tarteaucitronCookiesNumber') !== null) {
        document.getElementById('tarteaucitronCookiesNumber').innerHTML = nb
      }

      if (document.getElementById('tarteaucitronCookiesNumberBis') !== null) {
        document.getElementById('tarteaucitronCookiesNumberBis').innerHTML =
          nb + ' cookie' + s
      }

      const purgeBtns = document.getElementsByClassName('purgeBtn')
      for (let i = 0; i < purgeBtns.length; i++) {
        tarteaucitron.addClickEventToElement(purgeBtns[i], function () {
          tarteaucitron.cookie.purge([this.dataset.cookie])
          tarteaucitron.cookie.number()
          tarteaucitron.userInterface.jsSizing('cookie')
          return false
        })
      }

      for (i = 0; i < tarteaucitron.job.length; i += 1) {
        tarteaucitron.cookie.checkCount(tarteaucitron.job[i])
      }
    },
  },
  fixSelfXSS(html) {
    fixed = html
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
    return fixed
  },
  getLanguage() {
    'use strict'

    const availableLanguages =
      'bg,cn,cs,da,de,el,en,es,fi,fr,hu,it,ja,nl,oc,pl,pt,ro,ru,se,sk,tr,vi'
    const defaultLanguage = 'en'

    if (tarteaucitronForceLanguage !== '') {
      if (availableLanguages.includes(tarteaucitronForceLanguage)) {
        return tarteaucitronForceLanguage
      }
    }

    if (!navigator) {
      return 'en'
    }

    const lang =
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      navigator.userLang ||
      null
    const userLanguage = lang ? lang.substr(0, 2) : null

    if (!availableLanguages.includes(userLanguage)) {
      return defaultLanguage
    }
    return userLanguage
  },
  getLocale() {
    'use strict'
    if (!navigator) {
      return 'en_US'
    }

    const lang =
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      navigator.userLang ||
      null
    const userLanguage = lang ? lang.substr(0, 2) : null

    if (userLanguage === 'fr') {
      return 'fr_FR'
    } else if (userLanguage === 'en') {
      return 'en_US'
    } else if (userLanguage === 'de') {
      return 'de_DE'
    } else if (userLanguage === 'es') {
      return 'es_ES'
    } else if (userLanguage === 'it') {
      return 'it_IT'
    } else if (userLanguage === 'pt') {
      return 'pt_PT'
    } else if (userLanguage === 'nl') {
      return 'nl_NL'
    } else if (userLanguage === 'el') {
      return 'el_EL'
    } else {
      return 'en_US'
    }
  },
  addScript(url, id, callback, execute, attrName, attrVal, internal) {
    'use strict'
    let script
    let done = false

    if (execute === false) {
      if (typeof callback === 'function') {
        callback()
      }
    } else {
      script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = id !== undefined ? id : ''
      script.async = true
      script.src = url

      if (attrName !== undefined && attrVal !== undefined) {
        script.setAttribute(attrName, attrVal)
      }

      if (typeof callback === 'function') {
        if (!tarteaucitron.parameters.useExternalJs) {
          script.onreadystatechange = script.onload = function () {
            const state = script.readyState
            if (!done && (!state || /loaded|complete/.test(state))) {
              done = true
              callback()
            }
          }
        } else {
          callback()
        }
      }

      if (!tarteaucitron.parameters.useExternalJs || !internal) {
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    }
  },
  addInternalScript(url, id, callback, execute, attrName, attrVal) {
    tarteaucitron.addScript(url, id, callback, execute, attrName, attrVal, true)
  },
  makeAsync: {
    antiGhost: 0,
    buffer: '',
    init(url, id) {
      'use strict'
      const savedWrite = document.write
      const savedWriteln = document.writeln

      document.write = function (content) {
        tarteaucitron.makeAsync.buffer += content
      }
      document.writeln = function (content) {
        tarteaucitron.makeAsync.buffer += content.concat('\n')
      }

      setTimeout(function () {
        document.write = savedWrite
        document.writeln = savedWriteln
      }, 20000)

      tarteaucitron.makeAsync.getAndParse(url, id)
    },
    getAndParse(url, id) {
      'use strict'
      if (tarteaucitron.makeAsync.antiGhost > 9) {
        tarteaucitron.makeAsync.antiGhost = 0
        return
      }
      tarteaucitron.makeAsync.antiGhost += 1
      tarteaucitron.addInternalScript(url, '', function () {
        if (document.getElementById(id) !== null) {
          document.getElementById(id).innerHTML +=
            "<span class='display-none'>&nbsp;</span>" +
            tarteaucitron.makeAsync.buffer
          tarteaucitron.makeAsync.buffer = ''
          tarteaucitron.makeAsync.execJS(id)
        }
      })
    },
    execJS(id) {
      /* not strict because third party scripts may have errors */
      let i, scripts, childId, type

      if (document.getElementById(id) === null) {
        return
      }

      scripts = document.getElementById(id).getElementsByTagName('script')
      for (i = 0; i < scripts.length; i += 1) {
        type =
          scripts[i].getAttribute('type') !== null
            ? scripts[i].getAttribute('type')
            : ''
        if (type === '') {
          type =
            scripts[i].getAttribute('language') !== null
              ? scripts[i].getAttribute('language')
              : ''
        }
        if (
          scripts[i].getAttribute('src') !== null &&
          scripts[i].getAttribute('src') !== ''
        ) {
          childId = id + Math.floor(Math.random() * 99999999999)
          document.getElementById(id).innerHTML +=
            '<div id="' + childId + '"></div>'
          tarteaucitron.makeAsync.getAndParse(
            scripts[i].getAttribute('src'),
            childId
          )
        } else if (type.includes('javascript') || type === '') {
          eval(scripts[i].innerHTML)
        }
      }
    },
  },
  fallback(matchClass, content, noInner) {
    'use strict'
    const elems = document.getElementsByTagName('*')
    let i
    let index = 0

    for (i in elems) {
      if (elems[i] !== undefined) {
        for (index = 0; index < matchClass.length; index += 1) {
          if (
            (' ' + elems[i].className + ' ').includes(
              ' ' + matchClass[index] + ' '
            )
          ) {
            if (typeof content === 'function') {
              if (noInner === true) {
                content(elems[i])
              } else {
                elems[i].innerHTML = content(elems[i])
              }
            } else {
              elems[i].innerHTML = content
            }
          }
        }
      }
    }
  },
  engage(id) {
    'use strict'
    let html = ''
    const r = Math.floor(Math.random() * 100000)
    let engage =
      tarteaucitron.services[id].name + ' ' + tarteaucitron.lang.fallback

    if (tarteaucitron.lang['engage-' + id] !== undefined) {
      engage = tarteaucitron.lang['engage-' + id]
    }

    html += '<div class="tac_activate">'
    html += '   <div class="tac_float">'
    html += '      ' + engage
    //        html += '      <button type="button" class="tarteaucitronAllow" id="Eng' + r + 'ed' + id + '" onclick="tarteaucitron.userInterface.respond(this, true);">';
    html +=
      '      <button type="button" class="tarteaucitronAllow" id="Eng' +
      r +
      'ed' +
      id +
      '">'
    html += '          &#10003; ' + tarteaucitron.lang.allow
    html += '       </button>'
    html += '   </div>'
    html += '</div>'

    return html
  },
  extend(a, b) {
    'use strict'
    let prop
    for (prop in b) {
      if (b.hasOwnProperty(prop)) {
        a[prop] = b[prop]
      }
    }
  },
  proTemp: '',
  proTimer() {
    'use strict'
    setTimeout(tarteaucitron.proPing, 500)
  },
  pro(list) {
    'use strict'
    tarteaucitron.proTemp += list
    clearTimeout(tarteaucitron.proTimer)
    tarteaucitron.proTimer = setTimeout(tarteaucitron.proPing, 500)
  },
  proPing() {
    'use strict'
    if (
      tarteaucitron.uuid !== '' &&
      tarteaucitron.uuid !== undefined &&
      tarteaucitron.proTemp !== ''
    ) {
      const div = document.getElementById('tarteaucitronPremium')
      const timestamp = new Date().getTime()
      let url = 'https://tarteaucitron.io/log/?'

      if (div === null) {
        return
      }

      url += 'account=' + tarteaucitron.uuid + '&'
      url += 'domain=' + tarteaucitron.domain + '&'
      url += 'status=' + encodeURIComponent(tarteaucitron.proTemp) + '&'
      url += '_time=' + timestamp

      div.innerHTML = '<img src="' + url + '" class="display-none" />'

      tarteaucitron.proTemp = ''
    }

    tarteaucitron.cookie.number()
  },
  AddOrUpdate(source, custom) {
    /**
         Utility function to Add or update the fields of obj1 with the ones in obj2
         */
    for (key in custom) {
      if (custom[key] instanceof Object) {
        source[key] = tarteaucitron.AddOrUpdate(source[key], custom[key])
      } else {
        source[key] = custom[key]
      }
    }
    return source
  },
  getElemWidth(elem) {
    return elem.getAttribute('width') || elem.clientWidth
  },
  getElemHeight(elem) {
    return elem.getAttribute('height') || elem.clientHeight
  },
  addClickEventToId(elemId, func) {
    tarteaucitron.addClickEventToElement(document.getElementById(elemId), func)
  },
  addClickEventToElement(e, func) {
    if (e) {
      if (e.addEventListener) {
        e.addEventListener('click', func)
      } else {
        e.attachEvent('onclick', func)
      }
    }
  },
}
