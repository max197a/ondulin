$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);
  var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing for anime.js
  var lastClickEl;

  ////////////
  // READY - triggered when PJAX DONE
  ////////////

  // single time initialization
  legacySupport();
  initaos();
  _window.on("resize", debounce(setBreakpoint, 200));

  // on transition change
  getPaginationSections();
  pagination();
  _window.on("scroll", throttle(pagination, 50));
  _window.on("resize", debounce(pagination, 250));

  function pageReady() {
    // updateMapVars();

    initMasks();
    initAutogrow();
    initSelectric();
    initValidations();
    initTeleport();
    initPopups();
    initFormStyler();
    initSlider();

    // initMap();
  }

  // this is a master function which should have all functionality
  pageReady();

  //////////
  // COMMON
  //////////

  function initaos() {
    AOS.init();
  }

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  function initFormStyler() {
    setTimeout(function() {
      $('input[type="file"]').styler();
    }, 50);
  }

  // Prevent # behavior
  _document
    .on("click", '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on("click", "a[href]", function(e) {
      if (Barba.Pjax.transitionProgress) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.currentTarget.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    })
    .on("click", 'a[href^="#section"]', function(e) {
      // section scroll
      var el = $(this).attr("href");

      if ($(el).length === 0) {
        lastClickEl = $(this).get(0);
        Barba.Pjax.goTo($(".header__logo").attr("href"));
      } else {
        scrollToSection($(el));
      }

      return false;
    });

  function scrollToSection(el) {
    var headerHeight = $(".header").height();
    var targetScroll = el.offset().top - headerHeight;

    TweenLite.to(window, 1, {
      scrollTo: targetScroll,
      ease: easingSwing
    });
  }

  ////////////////////
  // CHANGE ORDER BUTTONS
  ////////////////////

  _document.on("click", "[js-order-btn]", function(e) {
    e.preventDefault();
    var $self = $(this),
      tabIndex = $self.index();
    $self.siblings().removeClass("is-active");
    $self.addClass("is-active");
    $(".order__tab")
      .removeClass("is-active")
      .css("display", "none")
      .eq(tabIndex)
      .fadeIn();
  });

  ////////////////////
  // CHANGE TITLE LOGIN PAGE
  ////////////////////

  _document.on("click", "[js-show-contacts]", function() {
    $(this)
      .parent()
      .toggleClass("show");
  });

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  _document.on("click", "[js-open-lit]", function() {
    $(".contacts__map").removeClass("is-active");
    $(".lit-map").addClass("is-active");
  });

  _document.on("click", "[js-open-usa]", function() {
    $(".contacts__map").removeClass("is-active");
    $(".usa-map").addClass("is-active");
  });

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  _document.on("click", "[js-show-pass]", function(e) {
    e.preventDefault();
    $(this).toggleClass("show-pass");
    var x = document.getElementById("l2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".header__menu").toggleClass("is-open");
    $("body").toggleClass("is-fixed");
    $("html").toggleClass("is-fixed");
  });

  // _document.on("click", ".header__menu-link, .header__btn", closeMobileMenu);

  // function closeMobileMenu() {
  //   $("[js-hamburger]").removeClass("is-active");
  //   $(".header__menu").removeClass("is-active");
  //   $("body").removeClass("is-fixed");
  //   $("html").removeClass("is-fixed");
  // }

  ////////////////////
  // FORM TOGGLER
  ////////////////////

  _document.on("click", "[open-form]", function() {
    $(".form-block-hidden").slideToggle();
  });

  _document.on("click", "[close-form]", function() {
    $(".form-block-hidden").slideToggle();
  });

  //////////
  // SLIDERS
  //////////

  function initSlider() {
    $("[js-carousel]").slick({
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      // dots: true,
      arrow: true,
      customPaging: function(slider, i) {
        var thumb = $(slider.$slides[i]).data();
        return "<a>" + i + "</a>";
      }
    });

    //custom function showing current slide
    var $status = $(".pagingInfo");
    var $slickElement = $("[js-carousel]");

    $slickElement.on("init reInit afterChange", function(
      event,
      slick,
      currentSlide,
      nextSlide
    ) {
      //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
      var i = (currentSlide ? currentSlide : 0) + 1;
      $status.text(i + "/" + slick.slideCount);
    });
  }

  //////////
  // MODALS
  //////////

  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(printable) {
    $("[js-teleport]").each(function(i, val) {
      var self = $(val);
      var objHtml = $(val).html();
      var target = $(
        "[data-teleport-target=" + $(val).data("teleport-to") + "]"
      );
      var conditionMedia = $(val)
        .data("teleport-condition")
        .substring(1);
      var conditionPosition = $(val)
        .data("teleport-condition")
        .substring(0, 1);

      if (target && objHtml && conditionPosition) {
        function teleport(shouldPrint) {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if (shouldPrint === true) {
            target.html(objHtml);
            self.html("");
          } else {
            if (condition) {
              target.html(objHtml);
              self.html("");
            } else {
              self.html(objHtml);
              target.html("");
            }
          }
        }

        if (printable == true) {
          teleport(printable);
        } else {
          teleport();
          _window.on(
            "resize",
            debounce(function() {
              teleport(printable);
            }, 100)
          );
        }
      }
    });
  }

  ////////////
  // UI
  ////////////
  function initAutogrow() {
    if ($("[js-autogrow]").length > 0) {
      $("[js-autogrow]").each(function(i, el) {
        new Autogrow(el);
      });
    }
  }

  // Masked input
  function initMasks() {
    $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
    // $("input[type='tel']").mask("(000) 000-0000", {
    //   placeholder: "+7 (___) ___-____"
    // });
  }

  // selectric
  function initSelectric() {
    $("select").selectric({
      maxHeight: 300,
      disableOnMobile: false,
      nativeOnMobile: false
    });
  }

  //////////
  // POPUPS
  //////////
  function initPopups() {
    $("[js-popup]").magnificPopup({
      removalDelay: 500, //delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: function() {
          this.st.mainClass = this.st.el.attr("data-effect");
        }
      },
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });

    $("[js-popup-image]").magnificPopup({
      type: "image",
      removalDelay: 500, //delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: function() {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace(
            "mfp-figure",
            "mfp-figure mfp-with-anim"
          );
          this.st.mainClass = this.st.el.attr("data-effect");
        }
      },
      closeOnContentClick: true,
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
  }

  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org
  function initValidations() {
    // GENERIC FUNCTIONS
    var validateErrorPlacement = function(error, element) {
      error.addClass("ui-input__validation");
      error.appendTo(element.parent("div"));
    };
    var validateHighlight = function(element) {
      $(element)
        .parent("div")
        .addClass("has-error");
    };
    var validateUnhighlight = function(element) {
      $(element)
        .parent("div")
        .removeClass("has-error");
    };
    var validateSubmitHandler = function(form) {
      $(form).addClass("loading");
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass("loading");
          var data = $.parseJSON(response);
          if (data.status == "success") {
            // do something I can't test
          } else {
            $(form)
              .find("[data-error]")
              .html(data.message)
              .show();
          }
        }
      });
    };

    var validatePhone = {
      required: true,
      normalizer: function(value) {
        var PHONE_MASK = "(XXX) XXX-XXXX";
        if (!value || value === PHONE_MASK) {
          return value;
        } else {
          return value.replace(/[^\d]/g, "");
        }
      },
      minlength: 11,
      digits: true
    };

    ////////
    // FORMS

    /////////////////////
    // REGISTRATION FORM
    ////////////////////

    $(".js-question").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phone: validatePhone,
        email: {
          required: true,
          email: true
        },
        area: "required"
        // phone: validatePhone
      },
      messages: {
        name: "Заполните это поле",
        phone: "Заполните это поле",
        email: {
          required: "Заполните это поле",
          email: "Введите правильно email"
        },
        area: "Заполните это поле"
      }
    });

    $(".reset__form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        email: {
          required: true,
          email: true
        }
      },
      messages: {
        email: {
          required: "Заполните это поле",
          email: "Введите правильно email"
        }
      }
    });

    $(".js-data").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        surname: "required",
        thirdname: "required",
        date: "required",
        phone: "required",
        email: {
          required: true
        }
      },
      messages: {
        phone: "Заполните это поле",
        name: "Заполните это поле",
        surname: "Заполните это поле",
        thirdname: "Заполните это поле",
        date: "Заполните это поле",
        email: {
          required: "Заполните это поле"
        }
      }
    });

    $(".js-shop").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        surname: "required",
        thirdname: "required",
        email: "required",
        birth: "required",
        adres: "required",
        phone: validatePhone
      },
      messages: {
        name: "Заполните это поле",
        surname: "Заполните это поле",
        thirdname: "Заполните это поле",
        email: "Заполните это поле",
        index: "Заполните это поле",
        adres: "Заполните это поле",
        phone: "Заполните это поле"
      }
    });

    $(".js-club").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        surname: "required",
        thirdname: "required",
        email: "required",
        birth: "required",
        type: "required"
      },
      messages: {
        name: "Заполните это поле",
        surname: "Заполните это поле",
        thirdname: "Заполните это поле",
        email: "Заполните это поле",
        index: "Заполните это поле",
        birth: "Заполните это поле",
        type: "Заполните это поле"
      }
    });

    $(".js-addobj").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        text: "required"
      },
      messages: {
        name: "Заполните это поле",
        text: "Заполните это поле"
      }
    });

    $(".js-person").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phone: validatePhone,
        email: {
          required: true,
          email: true
        },
        area: "required",
        file: "required"
        // phone: validatePhone
      },
      messages: {
        name: "Заполните это поле",
        phone: "Заполните это поле",
        email: {
          required: "Заполните это поле",
          email: "Введите правильно email"
        },
        area: "Заполните это поле",
        file: "Заполните это поле"
      }
    });
  }

  //////////
  // PAGINATION
  //////////
  var paginationAnchors, sections;

  function getPaginationSections() {
    paginationAnchors = $(".header__menu .header__menu-link");
    sections = $(".page__content [data-section]");
  }

  function pagination() {
    // Cache selectors
    var headerHeight = $(".header").height();
    var vScroll = _window.scrollTop();

    if (sections.length === 0) {
      paginationAnchors.removeClass("is-active");
      return false;
    }

    // Get id of current scroll item
    var cur = sections.map(function() {
      if ($(this).offset().top <= vScroll + headerHeight / 0.99) return this;
    });
    // Get current element
    cur = $(cur[cur.length - 1]);
    var id = cur && cur.length ? cur.data("section") : "1";

    // Set/remove active class
    paginationAnchors
      .removeClass("is-active")
      .filter("[data-section='" + id + "']")
      .addClass("is-active");
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var OverlayTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise.all([this.newContainerLoading, this.fadeOut()]).then(
        this.fadeIn.bind(this)
      );
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      // store overlay globally to access in fadein
      this.$overlay = $('<div class="js-transition-overlay"></div>');
      this.$overlay.insertAfter(".header");
      $("body").addClass("is-transitioning");

      TweenLite.fromTo(
        this.$overlay,
        0.6,
        {
          x: "0%"
        },
        {
          x: "100%",
          ease: Quart.easeIn,
          onComplete: function() {
            deferred.resolve();
          }
        }
      );

      return deferred.promise;
    },

    fadeIn: function() {
      var _this = this; // copy to acces inside animation callbacks
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: "visible"
      });

      TweenLite.to(window, 0.2, {
        scrollTo: 1,
        ease: easingSwing
      });

      AOS.refreshHard();

      // TweenLite.set(this.$overlay, {
      //   rotation: 0.01,
      //   force3D: true
      // });

      TweenLite.fromTo(
        this.$overlay,
        1,
        {
          x: "100%",
          overwrite: "all"
        },
        {
          x: "200%",
          ease: Expo.easeOut,
          delay: 0.2,
          onComplete: function() {
            _this.$overlay.remove();
            triggerBody();
            $("body").removeClass("is-transitioning");
            _this.done();
          }
        }
      );
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    // return FadeTransition;
    return OverlayTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  // event handlers
  Barba.Dispatcher.on("linkClicked", function(el) {
    lastClickEl = el; // save last click to detect transition type
  });

  Barba.Dispatcher.on("initStateChange", function(currentStatus) {
    var container = Barba.Pjax.Dom.getContainer();
    var haveContainer = $(container).find(".page__content").length > 0;

    if (!haveContainer) {
      // handle error - redirect ot page regular way
      window.location.href = currentStatus.url;
    }
  });

  Barba.Dispatcher.on("newPageReady", function(
    currentStatus,
    oldStatus,
    container,
    newPageRawHTML
  ) {
    pageReady();
  });

  Barba.Dispatcher.on("transitionCompleted", function() {
    getPaginationSections();
    pagination();

    if ($(lastClickEl).data("section")) {
      scrollToSection($($(lastClickEl).attr("href")));
    }
  });

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase();
    var displayCondition =
      wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0;
    if (displayCondition) {
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $(".page").append(content);
      setTimeout(function() {
        $(".dev-bp-debug").fadeOut();
      }, 1000);
      setTimeout(function() {
        $(".dev-bp-debug").remove();
      }, 1500);
    }
  }
});
