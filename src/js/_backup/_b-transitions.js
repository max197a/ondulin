// var OverlayTransition = Barba.BaseTransition.extend({
//   start: function() {
//     Promise
//       .all([this.newContainerLoading, this.fadeOut()])
//       .then(this.fadeIn.bind(this));
//   },
//
//   fadeOut: function() {
//     var deferred = Barba.Utils.deferred();
//
//     // store overlay globally to access in fadein
//     this.$overlay = $('<div class="js-transition-overlay"></div>')
//     this.$overlay.insertAfter(".header");
//
//     anime({
//       targets: this.$overlay.get(0),
//       translateX: ["0%", "100%"],
//       easing: 'easeInQuart',
//       duration: 600,
//       complete: function(anim) {
//         deferred.resolve();
//       }
//     });
//
//     return deferred.promise
//   },
//
//   fadeIn: function() {
//     var _this = this; // copy to acces inside animation callbacks
//     var $el = $(this.newContainer);
//
//     $(this.oldContainer).hide();
//
//     $el.css({
//       'visibility': 'visible'
//     })
//
//     anime({
//       targets: "html, body",
//       scrollTop: 1,
//       easing: easingSwing, // swing
//       duration: 150
//     });
//
//     anime({
//       targets: this.$overlay.get(0),
//       translateX: ["100%", "200%"],
//       easing: 'easeOutExpo',
//       duration: 1000,
//       delay: 200,
//       complete: function(anim) {
//         _this.$overlay.remove()
//         triggerBody();
//         AOS.refresh();
//         _this.done();
//       }
//     });
//
//   }
// });




// var FadeTransition = Barba.BaseTransition.extend({
//   start: function() {
//     Promise.all([this.newContainerLoading, this.fadeOut()]).then(
//       this.fadeIn.bind(this)
//     );
//   },
//
//   fadeOut: function() {
//     var deferred = Barba.Utils.deferred();
//
//     anime({
//       targets: this.oldContainer,
//       opacity: 0.5,
//       easing: easingSwing, // swing
//       duration: 300,
//       complete: function(anim) {
//         deferred.resolve();
//       }
//     });
//
//     return deferred.promise;
//   },
//
//   fadeIn: function() {
//     var _this = this;
//     var $el = $(this.newContainer);
//
//     $(this.oldContainer).hide();
//
//     $el.css({
//       visibility: "visible",
//       opacity: 0.5
//     });
//
//     anime({
//       targets: "html, body",
//       scrollTop: 1,
//       easing: easingSwing, // swing
//       duration: 150
//     });
//
//     anime({
//       targets: this.newContainer,
//       opacity: 1,
//       easing: easingSwing, // swing
//       duration: 300,
//       complete: function(anim) {
//         triggerBody();
//         _this.done();
//       }
//     });
//
//     AOS.refresh();
//   }
// });
