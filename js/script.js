"use strict";

(function () {
  // Global variables
  var userAgent = navigator.userAgent.toLowerCase(),
      initialDate = new Date(),
      $document = $(document),
      $window = $(window),
      $html = $("html"),
      $body = $("body"),
      isDesktop = $html.hasClass("desktop"),
      isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
      isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  var windowReady = false;
  var plugins = {
    bootstrapTooltip: $('[data-toggle="tooltip"]'),
    bootstrapDateTimePicker: $('[data-time-picker]'),
    bootstrapTabs: $('.tabs-custom'),
    customToggle: $('[data-custom-toggle]'),
    copyrightYear: $('.copyright-year'),
    checkbox: $('input[type="checkbox"]'),
    materialParallax: $('.parallax-container'),
    popover: $('[data-toggle="popover"]'),
    preloader: $('.preloader'),
    lightGallery: $('[data-lightgallery="group"]'),
    lightGalleryItem: $('[data-lightgallery="item"]'),
    lightDynamicGalleryItem: $('[data-lightgallery="dynamic"]'),
    forms: $('.rd-form'),
    rdNavbar: $('.rd-navbar'),
    rdInputLabel: $('.form-label'),
    regula: $('[data-constraints]'),
    viewAnimate: $('.view-animate'),
    wow: $('.wow'),
    maps: $('.google-map-container'),
    slick: $('.slick-slider'),
    customWaypoints: $('[data-custom-scroll-to]'),
    stepper: $("[data-stepper]"),
    selectFilter: $("select"),
    simpleBar: document.querySelectorAll('.simple-bar'),
    swiper: document.querySelectorAll('.swiper-container'),
    switcher: document.querySelectorAll('.js-switch')

    /**
     * @desc Check the element was been scrolled into the view
     * @param {object} elem - jQuery object
     * @return {boolean}
     */
  };function isScrolledIntoView(elem) {
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  /**
   * @desc Calls a function when element has been scrolled into the view
   * @param {object} element - jQuery object
   * @param {function} func - init function
   */
  function lazyInit(element, func) {
    var scrollHandler = function scrollHandler() {
      if (!element.hasClass('lazy-loaded') && isScrolledIntoView(element)) {
        func.call(element);
        element.addClass('lazy-loaded');
      }
    };

    scrollHandler();
    $window.on('scroll', scrollHandler);
  }

  // Initialize scripts that require a loaded window
  $window.on('load', function () {
    // Page loader & Page transition
    if (plugins.preloader.length) {
      pageTransition({
        target: document.querySelector('.page'),
        delay: 0,
        duration: 500,
        classIn: 'fadeIn',
        classOut: 'fadeOut',
        classActive: 'animated',
        conditions: function conditions(event, link) {
          return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
        },
        onTransitionStart: function onTransitionStart(options) {
          setTimeout(function () {
            plugins.preloader.removeClass('loaded');
          }, options.duration * .75);
        },
        onReady: function onReady() {
          plugins.preloader.addClass('loaded');
          windowReady = true;
        }
      });
    }

    // Material Parallax
    if (plugins.materialParallax.length) {
      if (!isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for (var i = 0; i < plugins.materialParallax.length; i++) {
          var $parallax = $(plugins.materialParallax[i]);

          $parallax.addClass('parallax-disabled');
          $parallax.css({ "background-image": 'url(' + $parallax.data("parallax-img") + ')' });
        }
      }
    }
  });

  // Initialize scripts that require a finished document
  $(function () {

    /**
     * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
     * @param {object} swiper - swiper instance
     */
    function setRealPrevious(swiper) {
      var element = swiper.$wrapperEl[0].children[swiper.activeIndex];
      swiper.realPrevious = Array.prototype.indexOf.call(element.parentNode.children, element);
    }

    /**
     * @desc Sets slides background images from attribute 'data-slide-bg'
     * @param {object} swiper - swiper instance
     */
    function setBackgrounds(swiper) {
      var swiperSlides = swiper.el.querySelectorAll('[data-slide-bg]');
      for (var _i = 0; _i < swiperSlides.length; _i++) {
        var swiperSlide = swiperSlides[_i];
        swiperSlide.style.backgroundImage = 'url(' + swiperSlide.getAttribute('data-slide-bg') + ')';
      }
    }

    /**
     * @desc Animate captions on active slides
     * @param {object} swiper - swiper instance
     */
    function initCaptionAnimate(swiper) {
      var animate = function animate(caption) {
        return function () {
          var duration = void 0;
          if (duration = caption.getAttribute('data-caption-duration')) caption.style.animationDuration = duration + 'ms';
          caption.classList.remove('not-animated');
          caption.classList.add(caption.getAttribute('data-caption-animate'));
          caption.classList.add('animated');
        };
      },
          initializeAnimation = function initializeAnimation(captions) {
        for (var _i2 = 0; _i2 < captions.length; _i2++) {
          var caption = captions[_i2];
          caption.classList.remove('animated');
          caption.classList.remove(caption.getAttribute('data-caption-animate'));
          caption.classList.add('not-animated');
        }
      },
          finalizeAnimation = function finalizeAnimation(captions) {
        for (var _i3 = 0; _i3 < captions.length; _i3++) {
          var caption = captions[_i3];
          if (caption.getAttribute('data-caption-delay')) {
            setTimeout(animate(caption), Number(caption.getAttribute('data-caption-delay')));
          } else {
            animate(caption)();
          }
        }
      };

      // Caption parameters
      swiper.params.caption = {
        animationEvent: 'slideChangeTransitionEnd'
      };

      initializeAnimation(swiper.$wrapperEl[0].querySelectorAll('[data-caption-animate]'));
      finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));

      if (swiper.params.caption.animationEvent === 'slideChangeTransitionEnd') {
        swiper.on(swiper.params.caption.animationEvent, function () {
          initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
          finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
        });
      } else {
        swiper.on('slideChangeTransitionEnd', function () {
          initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
        });

        swiper.on(swiper.params.caption.animationEvent, function () {
          finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
        });
      }
    }

    /**
     * @desc Attach form validation to elements
     * @param {object} elements - jQuery object
     */
    function attachFormValidator(elements, flag) {
      if (flag) {
        // Custom validator - phone number
        regula.custom({
          name: 'PhoneNumber',
          defaultMessage: 'Invalid phone number format',
          validator: function validator() {
            if (this.value === '') return true;else return (/^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value)
            );
          }
        });
      }

      var _loop = function _loop(_i5) {
        var o = $(elements[_i5]),
            v = void 0;
        if (!o.hasClass('form-control-has-validation')) {
          o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
          v = o.parent().find(".form-validation");
          if (v.is(":last-child")) o.addClass("form-control-last-child");

          o.on('input change propertychange blur', function (e) {
            var $this = $(this),
                results = void 0;

            if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
            if ($this.parents('.rd-mailform').hasClass('success')) return;

            if ((results = $this.regula('validate')).length) {
              for (_i5 = 0; _i5 < results.length; _i5++) {
                $this.siblings(".form-validation").text(results[_i5].message).parent().addClass("has-error");
              }
            } else {
              $this.siblings(".form-validation").text("").parent().removeClass("has-error");
            }
          }).regula('bind');
        }
        _i4 = _i5;
      };

      for (var _i4 = 0; _i4 < elements.length; _i4++) {
        _loop(_i4);
      }

      var regularConstraintsMessages = [{
        type: regula.Constraint.Required,
        newMessage: "The text field is required."
      }, {
        type: regula.Constraint.Email,
        newMessage: "The email is not a valid email."
      }, {
        type: regula.Constraint.Numeric,
        newMessage: "Only numbers are required"
      }, {
        type: regula.Constraint.Selected,
        newMessage: "Please choose an option."
      }];

      for (var _i6 = 0; _i6 < regularConstraintsMessages.length; _i6++) {
        var regularConstraint = regularConstraintsMessages[_i6];

        regula.override({
          constraintType: regularConstraint.type,
          defaultMessage: regularConstraint.newMessage
        });
      }
    }

    /**
     * @desc Check if all elements pass validation
     * @param {object} elements - object of items for validation
     * @param {object} captcha - captcha object for validation
     * @return {boolean}
     */
    function isValidated(elements) {
      var captcha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var results = void 0,
          errors = 0;

      if (elements.length) {
        for (var j = 0; j < elements.length; j++) {

          var $input = $(elements[j]);
          if ((results = $input.regula('validate')).length) {
            for (var k = 0; k < results.length; k++) {
              errors++;
              $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
            }
          } else {
            $input.siblings(".form-validation").text("").parent().removeClass("has-error");
          }
        }

        if (captcha) {
          if (captcha.length) {
            return validateReCaptcha(captcha) && errors === 0;
          }
        }

        return errors === 0;
      }
      return true;
    }

    /**
     * @desc Validate google reCaptcha
     * @param {object} captcha - captcha object for validation
     * @return {boolean}
     */
    function validateReCaptcha(captcha) {
      var captchaToken = captcha.find('.g-recaptcha-response').val();

      if (captchaToken.length === 0) {
        captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
        captcha.closest('.form-wrap').addClass('has-error');

        captcha.on('propertychange', function () {
          var $this = $(this),
              captchaToken = $this.find('.g-recaptcha-response').val();

          if (captchaToken.length > 0) {
            $this.closest('.form-wrap').removeClass('has-error');
            $this.siblings('.form-validation').removeClass('active').html('');
            $this.off('propertychange');
          }
        });

        return false;
      }

      return true;
    }

    /**
     * @desc Initialize Google reCaptcha
     */
    window.onloadCaptchaCallback = function () {
      for (var _i7 = 0; _i7 < plugins.captcha.length; _i7++) {
        var $captcha = $(plugins.captcha[_i7]),
            resizeHandler = function () {
          var frame = this.querySelector('iframe'),
              inner = this.firstElementChild,
              inner2 = inner.firstElementChild,
              containerRect = null,
              frameRect = null,
              scale = null;

          inner2.style.transform = '';
          inner.style.height = 'auto';
          inner.style.width = 'auto';

          containerRect = this.getBoundingClientRect();
          frameRect = frame.getBoundingClientRect();
          scale = containerRect.width / frameRect.width;

          if (scale < 1) {
            inner2.style.transform = 'scale(' + scale + ')';
            inner.style.height = frameRect.height * scale + 'px';
            inner.style.width = frameRect.width * scale + 'px';
          }
        }.bind(plugins.captcha[_i7]);

        grecaptcha.render($captcha.attr('id'), {
          sitekey: $captcha.attr('data-sitekey'),
          size: $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
          theme: $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
          callback: function callback() {
            $('.recaptcha').trigger('propertychange');
          }
        });

        $captcha.after("<span class='form-validation'></span>");

        if (plugins.captcha[_i7].hasAttribute('data-auto-size')) {
          resizeHandler();
          window.addEventListener('resize', resizeHandler);
        }
      }
    };

    /**
     * @desc Initialize Bootstrap tooltip with required placement
     * @param {string} tooltipPlacement
     */
    function initBootstrapTooltip(tooltipPlacement) {
      plugins.bootstrapTooltip.tooltip('dispose');

      if (window.innerWidth < 576) {
        plugins.bootstrapTooltip.tooltip({ placement: 'bottom' });
      } else {
        plugins.bootstrapTooltip.tooltip({ placement: tooltipPlacement });
      }
    }

    /**
     * @desc Initialize the gallery with set of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initLightGallery(itemsToInit, addClass) {
      $(itemsToInit).lightGallery({
        thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
        selector: "[data-lightgallery='item']",
        autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
        pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
        addClass: addClass,
        mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
        loop: $(itemsToInit).attr("data-lg-loop") !== "false"
      });
    }

    /**
     * @desc Initialize the gallery with dynamic addition of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initDynamicLightGallery(itemsToInit, addClass) {
      $(itemsToInit).on("click", function () {
        $(itemsToInit).lightGallery({
          thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
          selector: "[data-lightgallery='item']",
          autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
          pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
          addClass: addClass,
          mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
          loop: $(itemsToInit).attr("data-lg-loop") !== "false",
          dynamic: true,
          dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
        });
      });
    }

    /**
     * @desc Initialize the gallery with one image
     * @param {object} itemToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initLightGalleryItem(itemToInit, addClass) {
      $(itemToInit).lightGallery({
        selector: "this",
        addClass: addClass,
        counter: false,
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 0
        },
        vimeoPlayerParams: {
          byline: 0,
          portrait: 0
        }
      });
    }

    /**
     * @desc Google map function for getting latitude and longitude
     */
    function getLatLngObject(str, marker, map, callback) {
      var coordinates = {};
      try {
        coordinates = JSON.parse(str);
        callback(new google.maps.LatLng(coordinates.lat, coordinates.lng), marker, map);
      } catch (e) {
        map.geocoder.geocode({ 'address': str }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            callback(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)), marker, map);
          }
        });
      }
    }

    /**
     * @desc Initialize Google maps
     */
    function initMaps() {
      var key = void 0;

      for (var _i8 = 0; _i8 < plugins.maps.length; _i8++) {
        if (plugins.maps[_i8].hasAttribute("data-key")) {
          key = plugins.maps[_i8].getAttribute("data-key");
          break;
        }
      }

      $.getScript('//maps.google.com/maps/api/js?' + (key ? 'key=' + key + '&' : '') + 'sensor=false&libraries=geometry,places&v=quarterly', function () {
        var head = document.getElementsByTagName('head')[0],
            insertBefore = head.insertBefore;

        head.insertBefore = function (newElement, referenceElement) {
          if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1) {
            return;
          }
          insertBefore.call(head, newElement, referenceElement);
        };
        var geocoder = new google.maps.Geocoder();

        var _loop2 = function _loop2(_i9) {
          var zoom = parseInt(plugins.maps[_i9].getAttribute("data-zoom"), 10) || 11;
          var styles = plugins.maps[_i9].hasAttribute('data-styles') ? JSON.parse(plugins.maps[_i9].getAttribute("data-styles")) : [];
          var center = plugins.maps[_i9].getAttribute("data-center") || "New York";

          // Initialize map
          var map = new google.maps.Map(plugins.maps[_i9].querySelectorAll(".google-map")[0], {
            zoom: zoom,
            styles: styles,
            scrollwheel: false,
            center: { lat: 0, lng: 0 }
          });

          // Add map object to map node
          plugins.maps[_i9].map = map;
          plugins.maps[_i9].geocoder = geocoder;
          plugins.maps[_i9].keySupported = true;
          plugins.maps[_i9].google = google;

          // Get Center coordinates from attribute
          getLatLngObject(center, null, plugins.maps[_i9], function (location, markerElement, mapElement) {
            mapElement.map.setCenter(location);
          });

          // Add markers from google-map-markers array
          var markerItems = plugins.maps[_i9].querySelectorAll(".google-map-markers li");

          if (markerItems.length) {
            (function () {
              var markers = [];
              for (var j = 0; j < markerItems.length; j++) {
                var markerElement = markerItems[j];
                getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[_i9], function (location, markerElement, mapElement) {
                  var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                  var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
                  var info = markerElement.getAttribute("data-description") || "";
                  var country = markerElement.getAttribute("data-country") || "";
                  var city = markerElement.getAttribute("data-city") || "";
                  var image = markerElement.getAttribute("data-image") || "";
                  var airplaneName = markerElement.getAttribute("data-airplane-name") || "";
                  var timeStart = markerElement.getAttribute("data-time-start") || "";
                  var timeEnd = markerElement.getAttribute("data-time-end") || "";
                  var linkUrl = markerElement.getAttribute("data-link-url") || "";
                  var linkText = markerElement.getAttribute("data-link-text") || "";
                  var type = markerElement.getAttribute("data-marker-type") || 'default';

                  var markup = '';
                  if (type === 'airplane') {
                    markup = "<div class=\"map-popup\">\n                              <div class=\"map-popup-body\">\n                                <div class=\"map-popup-image\">\n                                  <img src=\"" + image + "\" alt=\"" + country + "\">\n                                </div>\n                                <div class=\"map-popup-content\">\n                                  <div class=\"map-popup-country\">" + country + "</div>\n                                  <div class=\"map-popup-city\">" + city + "</div>\n                                  <div class=\"map-popup-name\">" + airplaneName + "</div>\n                                  <div class=\"map-popup-time\">\n                                    Available: \n                                    <div class=\"map-popup-time-start\">" + timeStart + "</div>\n                                    <div class=\"map-popup-time-end\">" + timeEnd + "</div>\n                                  </div>\n                                </div>\n                              </div>\n                              <div class=\"map-popup-footer\">\n                                <a class=\"map-popup-link\" target=\"_blank\" href=\"" + linkUrl + "\">" + linkText + "</a>\n                              </div>\n                            </div>";
                  }

                  if (type === 'default') {
                    markup = "<div class=\"map-popup\">\n                              <div class=\"map-popup-info\">" + info + "</div>\n                              <div class=\"map-popup-footer\">\n                                <a class=\"map-popup-link\" target=\"_blank\" href=\"" + linkUrl + "\">" + linkText + "</a>\n                              </div>\n                            </div>";
                  }

                  var infoWindow = new google.maps.InfoWindow({
                    content: markup
                  });

                  markerElement.infoWindow = infoWindow;
                  var markerData = {
                    position: location,
                    map: mapElement.map
                  };
                  if (icon) {
                    markerData.icon = icon;
                  }
                  var marker = new google.maps.Marker(markerData);
                  markerElement.gmarker = marker;
                  markers.push({ markerElement: markerElement, infoWindow: infoWindow });
                  marker.isActive = false;
                  // Handle infoWindow close click
                  google.maps.event.addListener(infoWindow, 'closeclick', function (markerElement, mapElement) {
                    var markerIcon = null;
                    markerElement.gmarker.isActive = false;
                    markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                    markerElement.gmarker.setIcon(markerIcon);
                  }.bind(this, markerElement, mapElement));

                  // Set marker active on Click and open infoWindow
                  google.maps.event.addListener(marker, 'click', function (markerElement, mapElement) {
                    var markerIcon = void 0;
                    if (markerElement.infoWindow.getContent().length === 0) return;
                    var gMarker = void 0,
                        currentMarker = markerElement.gmarker,
                        currentInfoWindow = void 0;
                    for (var k = 0; k < markers.length; k++) {
                      if (markers[k].markerElement === markerElement) {
                        currentInfoWindow = markers[k].infoWindow;
                      }
                      gMarker = markers[k].markerElement.gmarker;
                      if (gMarker.isActive && markers[k].markerElement !== markerElement) {
                        gMarker.isActive = false;
                        markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                        gMarker.setIcon(markerIcon);
                        markers[k].infoWindow.close();
                      }
                    }

                    currentMarker.isActive = !currentMarker.isActive;
                    if (currentMarker.isActive) {
                      if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
                        currentMarker.setIcon(markerIcon);
                      }

                      currentInfoWindow.open(map, marker);
                    } else {
                      if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
                        currentMarker.setIcon(markerIcon);
                      }
                      currentInfoWindow.close();
                    }
                  }.bind(this, markerElement, mapElement));
                });
              }
            })();
          }
        };

        for (var _i9 = 0; _i9 < plugins.maps.length; _i9++) {
          _loop2(_i9);
        }
      });
    }

    // Additional class on html if mac os.
    if (navigator.platform.match(/(Mac)/i)) {
      document.querySelector('html').classList.add('mac-os');
    }

    // Adds some loosing functionality to IE browsers (IE Polyfills)
    if (isIE) {
      if (isIE === 12) $html.addClass("ie-edge");
      if (isIE === 11) $html.addClass("ie-11");
      if (isIE < 10) $html.addClass("lt-ie-10");
      if (isIE < 11) $html.addClass("ie-10");
    }

    // GDPR Section
    var $gdpr = document.querySelector('.gdpr-section');
    if ($gdpr) {
      if (!localStorage.getItem('gdpr')) {
        $gdpr.classList.add('active');
      }

      var $button = $gdpr.querySelector('.gdpr-button');

      $button.addEventListener('click', function (event) {
        event.preventDefault();
        $gdpr.classList.remove('active');
        localStorage.setItem('gdpr', 'true');
      });
    }

    // Bootstrap Tooltips
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
      initBootstrapTooltip(tooltipPlacement);

      $window.on('resize orientationchange', function () {
        initBootstrapTooltip(tooltipPlacement);
      });
    }

    // Popovers
    if (plugins.popover.length) {
      if (window.innerWidth < 767) {
        plugins.popover.attr('data-placement', 'bottom');
        plugins.popover.popover();
      } else {
        plugins.popover.popover();
      }
    }

    // Bootstrap tabs
    if (plugins.bootstrapTabs.length) {
      for (var _i10 = 0; _i10 < plugins.bootstrapTabs.length; _i10++) {
        var bootstrapTab = $(plugins.bootstrapTabs[_i10]);

        //If have slick carousel inside tab - resize slick carousel on click
        if (bootstrapTab.find('.slick-slider').length) {
          bootstrapTab.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
            var $this = $(this);
            var setTimeOutTime = 300;

            setTimeout(function () {
              $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
            }, setTimeOutTime);
          }, bootstrapTab));
        }

        var tabs = plugins.bootstrapTabs[_i10].querySelectorAll('.nav li a');

        for (var t = 0; t < tabs.length; t++) {
          var tab = tabs[t];

          if (t === 0) {
            tab.parentElement.classList.remove('active');
            $(tab).tab('show');
          }

          tab.addEventListener('click', function (event) {
            event.preventDefault();
            $(this).tab('show');
          });
        }
      }
    }

    // Copyright Year (Evaluates correct copyright year)
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }

    // Google maps
    if (plugins.maps.length) {
      lazyInit(plugins.maps, initMaps);
    }

    // UI To Top
    if (isDesktop) {
      $().UItoTop({
        easingType: 'easeOutQuad',
        containerClass: 'ui-to-top fa fa-angle-up'
      });
    }

    // RD Navbar
    if (plugins.rdNavbar.length) {
      var navbar = plugins.rdNavbar,
          aliases = { '-': 0, '-sm-': 576, '-md-': 768, '-lg-': 992, '-xl-': 1200, '-xxl-': 1600 },
          responsive = {};

      for (var alias in aliases) {
        var link = responsive[aliases[alias]] = {};
        if (navbar.attr('data' + alias + 'layout')) link.layout = navbar.attr('data' + alias + 'layout');
        if (navbar.attr('data' + alias + 'device-layout')) link.deviceLayout = navbar.attr('data' + alias + 'device-layout');
        if (navbar.attr('data' + alias + 'hover-on')) link.focusOnHover = navbar.attr('data' + alias + 'hover-on') === 'true';
        if (navbar.attr('data' + alias + 'auto-height')) link.autoHeight = navbar.attr('data' + alias + 'auto-height') === 'true';
        if (navbar.attr('data' + alias + 'stick-up-offset')) link.stickUpOffset = navbar.attr('data' + alias + 'stick-up-offset');
        if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';else if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
      }

      plugins.rdNavbar.RDNavbar({
        anchorNav: true,
        stickUpClone: plugins.rdNavbar.attr("data-stick-up-clone") ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
        responsive: responsive,
        autoHeight: false,
        callbacks: {
          onStuck: function onStuck() {
            var navbarSearch = this.$element.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
            }
          },
          onDropdownOver: function onDropdownOver() {
            return true;
          },
          onUnstuck: function onUnstuck() {
            if (this.$clone === null) return;

            var navbarSearch = this.$clone.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
              navbarSearch.trigger('blur');
            }
          }
        }
      });

      var currentScroll = 0;
      $window.scroll(function (event) {
        var nextScroll = $(this).scrollTop();

        if (nextScroll > currentScroll) {
          plugins.rdNavbar.addClass('scroll-bottom');
        } else {
          plugins.rdNavbar.removeClass('scroll-bottom');
        }

        currentScroll = nextScroll;
      });
    }

    // Add class in viewport
    if (plugins.viewAnimate.length) {
      for (var i = 0; i < plugins.viewAnimate.length; i++) {
        var $view = $(plugins.viewAnimate[i]).not('.active');
        $document.on("scroll", $.proxy(function () {
          if (isScrolledIntoView(this)) {
            this.addClass("active");
          }
        }, $view)).trigger("scroll");
      }
    }

    // Swiper
    if (plugins.swiper.length) {
      for (var _i11 = 0; _i11 < plugins.swiper.length; _i11++) {
        var sliderMarkup = plugins.swiper[_i11],
            swiper = void 0,
            options = {
          loop: sliderMarkup.getAttribute('data-loop') === 'true' || false,
          effect: isIE ? 'slide' : sliderMarkup.getAttribute('data-effect') || 'slide',
          direction: sliderMarkup.getAttribute('data-direction') || 'horizontal',
          speed: sliderMarkup.getAttribute('data-speed') ? Number(sliderMarkup.getAttribute('data-speed')) : 1000,
          allowTouchMove: false,
          centeredSlides: sliderMarkup.getAttribute('data-center-mod') === "true",
          preventIntercationOnTransition: true,
          runCallbacksOnInit: false,
          separateCaptions: sliderMarkup.getAttribute('data-separate-captions') === 'true' || false
        };

        if (sliderMarkup.getAttribute('data-autoplay')) {
          options.autoplay = {
            delay: Number(sliderMarkup.getAttribute('data-autoplay')) || 3000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
            reverseDirection: false
          };
        }

        if (sliderMarkup.getAttribute('data-keyboard') === 'true') {
          options.keyboard = {
            enabled: sliderMarkup.getAttribute('data-keyboard') === 'true',
            onlyInViewport: true
          };
        }

        if (sliderMarkup.getAttribute('data-mousewheel') === 'true') {
          options.mousewheel = {
            releaseOnEdges: true,
            sensitivity: .1
          };
        }

        if (sliderMarkup.querySelector('.swiper-button-next, .swiper-button-prev')) {
          options.navigation = {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          };
        }

        if (sliderMarkup.querySelector('.swiper-pagination')) {
          options.pagination = {
            el: '.swiper-pagination',
            type: sliderMarkup.getAttribute('data-pagination-type') || 'bullets',
            dynamicBullets: sliderMarkup.getAttribute('data-dynamic-bullets') === "true",
            clickable: true
          };
        }

        if (sliderMarkup.querySelector('.swiper-scrollbar')) {
          options.scrollbar = {
            el: '.swiper-scrollbar',
            hide: true,
            draggable: true
          };
        }

        options.on = {
          init: function init() {
            setBackgrounds(this);
            setRealPrevious(this);
            initCaptionAnimate(this);

            // Real Previous Index must be set recent
            this.on('slideChangeTransitionEnd', function () {
              setRealPrevious(this);
            });
          }
        };

        swiper = new Swiper(plugins.swiper[_i11], options);
      }
    }

    function leadingZero(decimal) {
      return decimal < 10 && decimal > 0 ? '0' + decimal : decimal;
    }

    // Slick carousel
    if (plugins.slick.length) {
      var _loop3 = function _loop3(_i12) {
        var $slickItem = $(plugins.slick[_i12]);

        $slickItem.on('init', function (slick) {
          initLightGallery($('[data-lightgallery="group-slick"]'), 'lightGallery-in-carousel');
          initLightGallery($('[data-lightgallery="item-slick"]'), 'lightGallery-in-carousel');
        });

        $slickItem.slick({
          slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
          asNavFor: $slickItem.attr('data-for') || false,
          dots: $slickItem.attr("data-dots") === "true",
          infinite: $slickItem.attr("data-loop") === "true",
          focusOnSelect: true,
          variableWidth: $slickItem.attr('data-auto-width') === "true",
          adaptiveHeight: $slickItem.attr("data-adaptive-height") === "true",
          arrows: $slickItem.attr("data-arrows") === "true",
          appendArrows: $slickItem.attr("data-arrows-class") || $slickItem,
          nextArrow: $slickItem.attr('data-custom-arrows') === "true" ? '<button type="button" class="slick-next"><svg width="48" height="13" viewBox="0 0 48 13" xmlns="http://www.w3.org/2000/svg">\n' + '<path fill-rule="evenodd" clip-rule="evenodd" d="M41.2236 6.00903V6.75903L-0.000396729 6.75903V6.00903L41.2236 6.00903ZM41.7126 12.769L41.3436 12.413L47.6056 6.37201L47.9746 6.72803L41.7126 12.769ZM41.3796 0L41.0016 0.365051L47.4176 6.55402L47.7946 6.19L41.3796 0ZM41.1906 12.769L40.8226 12.413L47.0786 6.37201L47.4476 6.72803L41.1906 12.769ZM40.8576 0L40.4796 0.365051L46.8956 6.55402L47.2726 6.19L40.8576 0Z" />\n' + '</svg>' + '</button>' : '<button type="button" class="slick-next"></button>',
          prevArrow: $slickItem.attr('data-custom-arrows') === "true" ? '<button type="button" class="slick-prev"><svg width="48" height="13" viewBox="0 0 48 13" xmlns="http://www.w3.org/2000/svg">\n' + '<path fill-rule="evenodd" clip-rule="evenodd" d="M6.75101 6.76001V6.01001H47.975V6.76001H6.75101ZM6.26199 0L6.63098 0.356018L0.368988 6.39703L0 6.04102L6.26199 0ZM6.595 12.769L6.97299 12.404L0.557007 6.21503L0.179993 6.57904L6.595 12.769ZM6.784 0L7.15201 0.356018L0.895996 6.39703L0.527008 6.04102L6.784 0ZM7.117 12.769L7.495 12.404L1.07901 6.21503L0.701996 6.57904L7.117 12.769Z" />\n' + '</svg>\n' + '</button>' : '<button type="button" class="slick-prev"></button>',
          swipe: $slickItem.attr("data-swipe") === "true",
          autoplay: $slickItem.attr("data-autoplay") === "true",
          fade: $slickItem.attr("data-fade") === "true",
          rtl: $('html').attr('dir') === 'rtl',
          vertical: $slickItem.attr("data-vertical") === "true",
          centerMode: $slickItem.attr('data-center-mode') === "true",
          customPaging: $slickItem.attr("data-custom-paging") === "true" ? function (slider, i) {
            return '<span class="slick-dot-divider"></span><span>' + slider.$slides.eq(i).find('[data-title]').html() + '</span>';
          } : function () {},
          centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
          mobileFirst: true,
          responsive: [{
            breakpoint: 0,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
            }
          }, {
            breakpoint: 575,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
            }
          }, {
            breakpoint: 767,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
            }
          }, {
            breakpoint: 991,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
            }
          }, {
            breakpoint: 1199,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1
            }
          }]
        }).on('afterChange', function (event, slick, currentSlide) {
          var $this = $(this),
              childCarousel = $this.attr('data-child');

          if (childCarousel) {
            $(childCarousel + ' .slick-slide').removeClass('slick-current');
            $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
          }
        });

        // Indexing Slick Slider
        if ($slickItem.attr('data-fraction')) {
          (function () {
            var fractionElement = document.querySelectorAll($slickItem.attr('data-fraction'))[0],
                fractionCurrent = fractionElement.querySelectorAll('.slick-fraction-current')[0],
                fractionAll = fractionElement.querySelectorAll('.slick-fraction-all')[0];

            $slickItem.on('afterChange', function (slick) {
              fractionCurrent.innerText = leadingZero(this.slick.currentSlide + 1);
              fractionAll.innerText = leadingZero(this.slick.slideCount);
            });

            $slickItem.trigger('afterChange');
          })();
        }

        // Slick Slider Services
        if ($slickItem.data('name') === 'slick-services') {
          if ($slickItem.data('custom-arrows') && $slickItem.data('arrows-class')) {
            var $navigation = $slickItem.data('arrows-class');
            var $service = $('.service').find('.service-body');
          }
        }
      };

      for (var _i12 = 0; _i12 < plugins.slick.length; _i12++) {
        _loop3(_i12);
      }
    }

    // WOW
    if ($html.hasClass("wow-animation") && plugins.wow.length && isDesktop) {
      new WOW().init();
    }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    // Regula
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula, true);
    }

    // lightGallery
    if (plugins.lightGallery.length) {
      for (var i = 0; i < plugins.lightGallery.length; i++) {
        initLightGallery(plugins.lightGallery[i]);
      }
    }

    // lightGallery item
    if (plugins.lightGalleryItem.length) {
      // Filter carousel items
      var notCarouselItems = [];

      for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
        if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
          notCarouselItems.push(plugins.lightGalleryItem[z]);
        }
      }

      plugins.lightGalleryItem = notCarouselItems;

      for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
        initLightGalleryItem(plugins.lightGalleryItem[i]);
      }
    }

    // Dynamic lightGallery
    if (plugins.lightDynamicGalleryItem.length) {
      for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
        initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
      }
    }

    // Custom Toggles
    if (plugins.customToggle.length) {
      for (var i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);

        $this.on('click', $.proxy(function (event) {
          event.preventDefault();

          var $ctx = $(this);
          $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
        }, $this));

        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length && e.data.find($(e.target)).length === 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          });
        }

        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          });
        }
      }
    }

    /**
     * Custom Waypoints
     */
    if (plugins.customWaypoints.length) {
      for (var _i13 = 0; _i13 < plugins.customWaypoints.length; _i13++) {
        var _$this = $(plugins.customWaypoints[_i13]);

        _$this.on('click', function (e) {
          e.preventDefault();

          $("body, html").stop().animate({
            scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
          }, 1000, function () {
            $window.trigger("resize");
          });
        });
      }
    }

    // RD Forms
    if (plugins.forms.length) {
      for (var _i14 = 0; _i14 < plugins.forms.length; _i14++) {
        $this = $(plugins.forms[_i14]);

        var $inputsFiles = plugins.forms[_i14].querySelectorAll('.form-wrap-file');

        $inputsFiles.forEach(function (item) {
          var input = item.querySelector('[type="form-input"]');
          var file = item.querySelector('[type="file"]');
          var label = item.querySelector('.form-label-file');

          file.addEventListener('change', function (event) {
            var name = event.target.files[0].name;

            if (name !== undefined) label.innerHTML = name;else label.innerHTML = '';
          });
        });

        $this.on('submit', function (e) {
          e.preventDefault();

          var inputs = $(this).find("[data-constraints]");
          var otherInputs = $(this).find("[data-not-constraints]");

          if (isValidated(inputs) && inputs.length) {

            var _output = $("#" + $(this).attr("data-form-output"));

            $(this).clearForm();

            $(this).find('.form-label-file').each(function () {
              this.innerHTML = '';
            });

            plugins.selectFilter.val(null).trigger('change');

            otherInputs.each(function () {
              $(this).val($(this).attr('value'));
            });

            $(this).addClass('form-in-process');

            if (_output.hasClass("snackbars")) {
              _output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
              _output.addClass("active");
            }

            $(this).find('label').removeClass('focus not-empty');

            setTimeout(function () {
              $(this).addClass('success').removeClass('form-in-process');
              _output.addClass("active success");
              _output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + 'The message successfully send' + '</span></p>');

              setTimeout(function () {
                _output.removeClass("active error success");
                $(this).removeClass('success');
              }.bind($(this)), 2000);
            }.bind($(this)), 1000);
          }

          if (!inputs.length) {
            var output = $("#" + $(this).attr("data-form-output"));

            $(this).addClass('form-in-process');
            output.addClass('error');

            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>We dont have any data!</span></p>');
              output.addClass("active");
            }

            setTimeout(function () {
              output.removeClass("active error success");
              $(this).removeClass('success');
            }, 2000);
          }
        });
      }
    }

    // Snackbar Error Demo
    var $snackbarButton = $('[data-snackbar]');
    var $snackbarGlobal = $('#form-output-global');
    if ($snackbarButton.length && $snackbarGlobal.length) {
      var _loop4 = function _loop4(_i15) {
        var $button = $($snackbarButton[_i15]);
        var options = $button.data('snackbar');
        var type = options.type || 'info';
        var message = options.message || 'Something went wrong';
        var isActive = false;

        $button.on('click', function (event) {
          if (!isActive) {
            $snackbarGlobal.addClass("active " + type);
            $snackbarGlobal.html('<p><span class="icon text-middle mdi mdi-exclamation icon-xxs"></span><span>' + message + '</span></p>');
            isActive = true;

            setTimeout(function () {
              $snackbarGlobal.removeClass("active error success info warning");
              $snackbarGlobal.html('');
              isActive = false;
            }, 2000);
          }
        });
      };

      for (var _i15 = 0; _i15 < $snackbarButton.length; _i15++) {
        _loop4(_i15);
      }
    }

    /*
    * Form Flight
    */

    function countPassengers(inputs) {
      var result = 0;

      inputs.each(function (item) {
        result += parseInt($(this).val());
      });

      return result;
    }

    var $formFlight = $('.form-flight-route');
    if ($formFlight.length) {
      $formFlight.each(function () {
        var $changeValue = $(this).find('.form-flight-route-change-values');
        if ($changeValue.length) {
          var $inputs = $changeValue.find('input');
          var $toggle = $changeValue.find('.form-flight-route-change-values-item');

          $toggle.on('click', function () {
            $inputs = $changeValue.find('input');
            var text0 = $($inputs[0]).val();
            var text1 = $($inputs[1]).val();

            $($inputs[0]).val(text1);
            $($inputs[1]).val(text0);
          });
        }

        var $stepper = $(this).find('.form-stepper-wrapper');

        var $arrows = $(this).find('.stepper-arrow');

        var $stepperBlock = $stepper.find('.form-stepper-block');

        var $stepperInputs = $stepperBlock.find('input');

        var $title = $stepper.find('.form-stepper-title');
        var $titleCount = $title.find('.form-stepper-count');
        var $titleText = $title.find('.form-stepper-text');

        var passengersAmount = countPassengers($stepperInputs);

        $titleCount.html(passengersAmount);

        if (passengersAmount > 1) {
          $titleText.html('passengers');
        } else {
          $titleText.html('passenger');
        }

        $stepperInputs.on('change', function () {
          $stepperInputs = $stepperBlock.find('input');
          passengersAmount = countPassengers($stepperInputs);

          $titleCount.html(passengersAmount);

          if (passengersAmount > 1) {
            $titleText.html('passengers');
          } else {
            $titleText.html('passenger');
          }
        });
      });
    }

    var $formFlighCites = document.querySelector('.form-flight-route-multy-city');

    function formHandle(event) {
      var $row = event.currentTarget.querySelector('.form-flight-route-multy-city-row');
      var $rowJquery = $('.form-flight-route-multy-city-row');

      if (event.target.classList.contains('form-flight-route-multy-city-add-new-item')) {
        var id = event.currentTarget.querySelectorAll('.form-flight-route-multy-city-item').length + 1;
        $row.insertAdjacentHTML('beforeend', "\n            <div class=\"form-flight-route-multy-city-item\" id=\"form-flight-route-multy-city-item-" + id + "\">\n              <div class=\"row row-small row-10\">\n                <div class=\"col-lg-4\">\n                  <div class=\"form-wrap\">\n                    <input class=\"form-input\" id=\"flight-route-multy-city-from-" + id + "\" type=\"text\" name=\"from-" + id + "\" data-constraints=\"@Required\">\n                    <label class=\"form-label\" for=\"flight-route-multy-city-from-" + id + "\">From: Origin city, country or airport</label>\n                  </div>\n                </div>\n                <div class=\"col-lg-4\">\n                  <div class=\"form-wrap\">\n                    <input class=\"form-input\" id=\"flight-route-multy-city-to-" + id + "\" type=\"text\" name=\"to-" + id + "\" data-constraints=\"@Required\">\n                    <label class=\"form-label\" for=\"flight-route-multy-city-to-" + id + "\">To: Destination city, country or</label>\n                  </div>\n                </div>\n                <div class=\"col-lg-4\">\n                  <div class=\"form-wrap\">\n                    <input class=\"form-input\" id=\"flight-route-multy-city-departure-" + id + "\" type=\"text\" data-time-picker=\"date\" name=\"departure-" + id + "\" data-constraints=\"@Required\">\n                    <label class=\"form-label\" for=\"flight-route-multy-city-departure-" + id + "\">Departure:</label>\n                  </div>\n                </div>\n              </div>\n              <div class=\"form-flight-route-multy-city-delete\">\n                <div class=\"form-flight-route-multy-city-delete-icon\" data-id=\"#form-flight-route-multy-city-item-" + id + "\"></div>\n              </div>\n            </div>\n          ");
        $rowJquery.find('.form-label').RDInputLabel();
        attachFormValidator($rowJquery.find('[data-constraints]'), false);
        bootstrapDateTimePickerInit($rowJquery.find('[data-time-picker]'));
      }

      if (event.target.classList.contains('form-flight-route-multy-city-delete-icon')) {
        event.target.closest('.form-flight-route-multy-city-item').remove();
      }
    }

    if ($formFlighCites) {
      $formFlighCites.addEventListener('click', formHandle);
      $formFlighCites.querySelector('.form-flight-route-multy-city-add-new-item').addEventListener('click', function (e) {
        return e.preventDefault();
      });
    }

    // Bootstrap Date time picker
    function bootstrapDateTimePickerInit(elements) {
      for (var _i16 = 0; _i16 < elements.length; _i16++) {
        var $dateTimePicker = $(elements[_i16]);
        var _type = $dateTimePicker.attr("data-time-picker");
        var _options = { shortTime: true };

        if (_type.includes('date')) {
          _options.date = true;
          _options.time = false;
          _options.format = 'dddd DD MMMM YYYY';
          _options.minDate = new Date();
        }

        if (_type.includes('time')) {
          _options.time = true;
          _options.date = false;
          _options.format = 'HH:mm';
        }

        if (_type === 'datetime') {
          _options.time = true;
          _options.date = true;
          _options.minDate = new Date();
          _options.format = 'dddd DD MMMM YYYY - HH:mm';
        }

        $dateTimePicker.bootstrapMaterialDatePicker(_options);
      }
    }

    if (plugins.bootstrapDateTimePicker.length) {
      bootstrapDateTimePickerInit(plugins.bootstrapDateTimePicker);
    }

    /**
     * Stepper
     * @description Enables Stepper Plugin
     */
    function getStepperData(stepper) {
      return {
        value: parseInt(stepper.val()),
        min: parseInt(stepper.attr('min')),
        max: parseInt(stepper.attr('max'))
      };
    }

    function checkStepperState(data, arrowUp, arrowDown) {
      if (data.value === data.min) {
        arrowDown.addClass('disabled');
      } else {
        arrowDown.removeClass('disabled');
      }

      if (data.value === data.max) {
        arrowUp.addClass('disabled');
      } else {
        arrowUp.removeClass('disabled');
      }
    }

    function changeStepperState(stepper, arrowUp, arrowDown) {
      var $arrowUp = stepper.parent().find(arrowUp);
      var $arrowDown = stepper.parent().find(arrowDown);

      checkStepperState(getStepperData(stepper), $arrowUp, $arrowDown);
    }

    if (plugins.stepper.length) {
      plugins.stepper.stepper({
        labels: {
          up: "",
          down: ""
        }
      });

      changeStepperState(plugins.stepper, '.up', '.down');

      plugins.stepper.on('change', function () {
        changeStepperState($(this), '.up', '.down');
      });
    }

    // Simple Bar
    if (plugins.simpleBar.length) {
      for (var _i17 = 0; _i17 < plugins.simpleBar.length; _i17++) {
        var $element = plugins.simpleBar[_i17];

        var _options2 = {
          direction: document.querySelector('html').getAttribute('dir')
        };

        var simpleBar = new SimpleBar($element, _options2);
      }
    }

    // Select 2
    if (plugins.selectFilter.length) {
      for (var _i18 = 0; _i18 < plugins.selectFilter.length; _i18++) {
        var select = $(plugins.selectFilter[_i18]);

        select.select2({
          dropdownParent: $('.page'),
          placeholder: select.attr('data-placeholder') || null,
          minimumResultsForSearch: select.attr('data-minimum-results-search') || Infinity,
          containerCssClass: select.attr('data-container-class') || null,
          dropdownCssClass: select.attr('data-dropdown-class') || null
        });
      }
    }

    if (plugins.switcher.length) {
      for (var _i19 = 0; _i19 < plugins.switcher.length; _i19++) {
        var element = plugins.switcher[_i19];
        var _options3 = JSON.parse(element.getAttribute('data-options')) || {};
        var init = new Switchery(plugins.switcher[_i19], _options3);
      }
    }
  });
})();