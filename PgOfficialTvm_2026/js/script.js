/* ============================================================
   PG OFFICIAL TVM — Site scripts
   Organized into small, independent modules. Each module checks
   for the elements it needs before running, so this file is safe
   to include on every page (home + legal + utility pages).
   ============================================================ */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); };

  /* ---------------- Header / nav / scrollspy ---------------- */
  var Header = {
    init: function () {
      this.header = $(".header");
      this.navbar = $(".navbar");
      this.menuBtn = $("#menu-btn");
      if (!this.header) return;

      on(this.menuBtn, "click", this.toggleMenu.bind(this));
      on(window, "scroll", this.onScroll.bind(this), { passive: true });
      this.onScroll();

      // Close mobile menu after choosing a link
      $$(".navbar a").forEach(function (a) {
        on(a, "click", function () {
          document.querySelector(".navbar").classList.remove("active");
          var btn = document.querySelector("#menu-btn");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
      });

      this.sections = $$("section[id]");
      this.navLinks = $$(".header .navbar a[href*='#']");
      if (this.sections.length && this.navLinks.length) {
        on(window, "scroll", this.scrollSpy.bind(this), { passive: true });
        this.scrollSpy();
      }
    },
    toggleMenu: function () {
      var expanded = this.menuBtn.getAttribute("aria-expanded") === "true";
      this.menuBtn.setAttribute("aria-expanded", String(!expanded));
      this.navbar.classList.toggle("active");
    },
    onScroll: function () {
      if (window.scrollY > 10) {
        this.header.classList.add("is-scrolled");
      } else {
        this.header.classList.remove("is-scrolled");
      }
    },
    scrollSpy: function () {
      var top = window.scrollY;
      this.sections.forEach(function (sec) {
        var offset = sec.offsetTop - 220;
        var height = sec.offsetHeight;
        var id = sec.getAttribute("id");
        if (top >= offset && top < offset + height) {
          $$(".header .navbar a").forEach(function (link) { link.classList.remove("active"); });
          var match = document.querySelector(".header .navbar a[href*='#" + id + "']");
          if (match) match.classList.add("active");
        }
      });
    }
  };

  /* ---------------- Scroll progress bar ---------------- */
  var ScrollProgress = {
    init: function () {
      this.bar = $(".scroll-progress");
      if (!this.bar) return;
      on(window, "scroll", this.update.bind(this), { passive: true });
      this.update();
    },
    update: function () {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      this.bar.style.width = pct + "%";
    }
  };

  /* ---------------- Back to top ---------------- */
  var BackToTop = {
    init: function () {
      this.btn = $("#back-to-top");
      if (!this.btn) return;
      on(window, "scroll", this.onScroll.bind(this), { passive: true });
      on(this.btn, "click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
    onScroll: function () {
      this.btn.classList.toggle("show", window.scrollY > 500);
    }
  };

  /* ---------------- Lightweight scroll reveal (data-reveal) ---------------- */
  var Reveal = {
    init: function () {
      var items = $$("[data-reveal]");
      if (!items.length) return;
      if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("is-visible"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      items.forEach(function (el) { io.observe(el); });
    }
  };

  /* ---------------- Animated counters ---------------- */
  var Counters = {
    init: function () {
      var els = $$("[data-count-to]");
      if (!els.length || !("IntersectionObserver" in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            Counters.run(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      els.forEach(function (el) { io.observe(el); });
    },
    run: function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString("en-IN") + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("en-IN") + suffix;
      }
      requestAnimationFrame(step);
    }
  };

  /* ---------------- About "read more" ---------------- */
  var ReadMore = {
    init: function () {
      var btn = $("#readmorebtn");
      var content = $("#readmore");
      if (!btn || !content) return;
      content.hidden = true;
      on(btn, "click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        content.hidden = expanded;
        btn.textContent = expanded ? "read more" : "read less";
      });
    }
  };

  /* ---------------- FAQ accordion (native <details>, JS just for single-open UX) ---------------- */
  var Faq = {
    init: function () {
      var items = $$(".faq-item");
      if (!items.length) return;
      items.forEach(function (item) {
        on(item, "toggle", function () {
          if (item.open) {
            items.forEach(function (other) {
              if (other !== item) other.open = false;
            });
          }
        });
      });
    }
  };

  /* ---------------- Sliders (Swiper) ---------------- */
  var Sliders = {
    init: function () {
      if (typeof Swiper === "undefined") return;

      if ($(".products-slider")) {
        new Swiper(".products-slider", {
          spaceBetween: 28,
          loop: true,
          autoplay: { delay: 5500, disableOnInteraction: false },
          grabCursor: true,
          navigation: { nextEl: ".products-slider .swiper-button-next", prevEl: ".products-slider .swiper-button-prev" },
          pagination: { el: ".products-slider .swiper-pagination", clickable: true },
          keyboard: { enabled: true },
          breakpoints: {
            0: { slidesPerView: 1.05 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1400: { slidesPerView: 4 }
          }
        });
      }
    }
  };

  /* ---------------- AOS init ---------------- */
  var AosInit = {
    init: function () {
      if (typeof AOS === "undefined") return;
      AOS.init({ delay: 100, duration: 700, once: true, offset: 60, easing: "ease-out-cubic" });
    }
  };

  /* ---------------- Contact form (progressive enhancement over Web3Forms) ---------------- */
  var ContactForm = {
    init: function () {
      this.form = $("#contact-form");
      if (!this.form) return;
      on(this.form, "submit", this.onSubmit.bind(this));
    },
    validators: {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
      number: function (v) { return /^[0-9+\s-]{7,15}$/.test(v); },
      message: function (v) { return v.trim().length >= 8; }
    },
    onSubmit: function (e) {
      e.preventDefault();
      var form = this.form;
      var status = $(".form-status", form);
      var valid = true;

      // Honeypot spam trap (Web3Forms "botcheck" convention)
      var honey = form.querySelector("input[name='botcheck']");
      if (honey && honey.checked) { return; }

      ["name", "email", "number", "message"].forEach(function (name) {
        var input = form.querySelector("[name='" + name + "']");
        if (!input) return;
        var field = input.closest(".field");
        var ok = ContactForm.validators[name](input.value || "");
        if (field) field.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        if (status) {
          status.textContent = "Please check the highlighted fields and try again.";
          status.className = "form-status show error";
        }
        return;
      }

      var submitBtn = form.querySelector("button[type='submit'], input[type='submit']");
      var originalLabel = submitBtn ? (submitBtn.value || submitBtn.textContent) : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        if ("value" in submitBtn) submitBtn.value = "Sending…"; else submitBtn.textContent = "Sending…";
      }

      var data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function (result) {
          if (status) {
            status.textContent = "Thanks! Your message has been sent — we'll get back to you shortly.";
            status.className = "form-status show success";
          }
          form.reset();
        })
        .catch(function () {
          if (status) {
            status.textContent = "Something went wrong sending your message. Please WhatsApp us instead.";
            status.className = "form-status show error";
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            if ("value" in submitBtn) submitBtn.value = originalLabel; else submitBtn.textContent = originalLabel;
          }
        });
    }
  };

  /* ---------------- Newsletter (submits via the same Web3Forms endpoint) ---------------- */
  var Newsletter = {
    init: function () {
      var form = $("#newsletter-form");
      if (!form) return;
      on(form, "submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input[type='email']");
        var msg = $(".newsletter-msg", form.parentElement);
        if (!input || !input.checkValidity()) return;

        var btn = form.querySelector("button, input[type='submit']");
        var label = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Joining…"; }

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        })
          .then(function () {
            if (msg) { msg.textContent = "You're on the list — thanks for subscribing!"; msg.hidden = false; }
            form.reset();
          })
          .catch(function () {
            if (msg) { msg.textContent = "Couldn't subscribe right now — please try again later."; msg.hidden = false; }
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = label; }
          });
      });
    }
  };

  /* ---------------- Lightbox (native <dialog>) ---------------- */
  var Lightbox = {
    init: function () {
      this.dialog = $("#lightbox");
      if (!this.dialog) return;
      this.img = $("#lightbox-img", this.dialog);
      this.title = $("#lightbox-title", this.dialog);

      $$("[data-lightbox-trigger]").forEach(function (btn) {
        on(btn, "click", function () { Lightbox.open(btn); });
      });
      on($(".lightbox-close", this.dialog), "click", function () { Lightbox.dialog.close(); });
      on(this.dialog, "click", function (e) {
        if (e.target === Lightbox.dialog) Lightbox.dialog.close();
      });
    },
    open: function (btn) {
      var src = btn.getAttribute("data-img");
      var title = btn.getAttribute("data-title") || "";
      if (this.img) { this.img.src = src; this.img.alt = title; }
      if (this.title) this.title.textContent = title;
      if (typeof this.dialog.showModal === "function") this.dialog.showModal();
      else this.dialog.setAttribute("open", "");
    }
  };

  /* ---------------- Share (Web Share API with WhatsApp fallback) ---------------- */
  var Share = {
    init: function () {
      $$("[data-share-trigger]").forEach(function (btn) {
        on(btn, "click", function (e) {
          e.preventDefault();
          var text = btn.getAttribute("data-share-text") || document.title;
          var url = btn.getAttribute("data-share-url") || window.location.href;
          if (navigator.share) {
            navigator.share({ title: document.title, text: text, url: url }).catch(function () {});
          } else {
            window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
          }
        });
      });
    }
  };

  /* ---------------- Cookie consent ---------------- */
  var CookieConsent = {
    key: "pgtvm-cookie-consent",
    init: function () {
      this.banner = $("#cookie-banner");
      if (!this.banner) return;
      var consent = null;
      try { consent = localStorage.getItem(this.key); } catch (e) {}
      if (!consent) {
        setTimeout(function () { CookieConsent.banner.classList.add("show"); }, 900);
      }
      on($("#cookie-accept"), "click", function () { CookieConsent.set("accepted"); });
      on($("#cookie-decline"), "click", function () { CookieConsent.set("declined"); });
    },
    set: function (value) {
      try { localStorage.setItem(this.key, value); } catch (e) {}
      this.banner.classList.remove("show");
    }
  };

  /* ---------------- Init everything once DOM is ready ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    Header.init();
    ScrollProgress.init();
    BackToTop.init();
    Reveal.init();
    Counters.init();
    ReadMore.init();
    Faq.init();
    Sliders.init();
    AosInit.init();
    ContactForm.init();
    Newsletter.init();
    CookieConsent.init();
    Lightbox.init();
    Share.init();
  });
})();
