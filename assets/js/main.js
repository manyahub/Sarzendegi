(function() {
  "use strict";

  /*---------- Easy selector helper function ----------*/
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /*---------- Easy event listener function ----------*/
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /*---------- Easy on scroll event listener ----------*/
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /*---------- Navbar links active state on scroll ----------*/
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /*---------- Scrolls to an element with header offset ----------*/
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /*---------- Toggle .header-scrolled class to #header when page is scrolled ----------*/
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /*---------- Intro type effect ----------*/
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 30,
      backDelay: 4000
    });
  }

  /*---------- Mobile nav toggle ----------*/
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /*---------- Mobile nav dropdowns activate ----------*/
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /*---------- Scroll with offset on links with a class name .scrollto ----------*/
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /*---------- Scroll with offset on page load with fragments in the url ----------*/
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });


  /*----------  Contact Form ----------*/
  const form = document.getElementById('contactForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');
  const messageInput = document.getElementById('message');
  const messageError = document.getElementById('messageError');
  const successPopup = document.getElementById('successPopup');

  form.addEventListener('submit', function (e) {
    let isValid = true;

    // چک ایمیل
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      emailError.classList.remove('d-none');
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else {
      emailError.classList.add('d-none');
      emailInput.classList.remove('is-invalid');
    }

    // چک شماره تلفن
    const phonePattern = /^09\d{9}$/;
    if (!phonePattern.test(phoneInput.value)) {
      phoneError.classList.remove('d-none');
      phoneInput.classList.add('is-invalid');
      isValid = false;
    } else {
      phoneError.classList.add('d-none');
      phoneInput.classList.remove('is-invalid');
    }

    // چک پیام
    if (!messageInput.value.trim()) {
      messageError.classList.remove('d-none');
      messageInput.classList.add('is-invalid');
      isValid = false;
    } else {
      messageError.classList.add('d-none');
      messageInput.classList.remove('is-invalid');
    }

    if (!isValid) {
      e.preventDefault();
      return;
    }

    // نمایش پاپ‌آپ بعد از ارسال
    e.preventDefault(); // جلوگیری از ارسال فرم خودکار اول

    // ارسال فرم به URL اکشن با fetch API
    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      },
    }).then(response => {
      if (response.ok) {
        successPopup.classList.remove('d-none');

        // پاک کردن فرم
        form.reset();

        // بستن پاپ‌آپ با کلیک در هرجای صفحه
        const closePopup = () => {
          successPopup.classList.add('d-none');
          document.removeEventListener('click', closePopup);
        };
        setTimeout(() => {
          document.addEventListener('click', closePopup);
        }, 100);
      } else {
        alert('خطا در ارسال فرم، لطفاً دوباره تلاش کنید.');
      }
    }).catch(error => {
      alert('خطا در ارسال فرم، لطفاً دوباره تلاش کنید.');
    });

  });

  /*---------- Back to top button ----------*/
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

})()
