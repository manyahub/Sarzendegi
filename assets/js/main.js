(function () {
  "use strict";

  /*-------------------- Easy selector helper function --------------------*/
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /*-------------------- Easy event listener function --------------------*/
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /*-------------------- Easy on scroll event listener --------------------*/
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /*-------------------- Navbar links active state on scroll --------------------*/
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /*-------------------- Scrolls to an element with header offset --------------------*/
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 16;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /*-------------------- Toggle .header-scrolled class to #header when page is scrolled --------------------*/
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /*-------------------- Intro type effect --------------------*/
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 30,
      backDelay: 4000,
    });
  }

  /*-------------------- Mobile nav toggle --------------------*/

  document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('menu-trigger').checked = false;
    });
  });



  /*-------------------- Scroll with offset on links with a class name .scrollto --------------------*/
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /*-------------------- Scroll with offset on page load with fragments in the url --------------------*/
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /*--------------------  Massage Type Modal PopUps --------------------*/
document.addEventListener('DOMContentLoaded', function () {
  function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('show');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('show');
}

  window.openModal = openModal;
  window.closeModal = closeModal;

  function scrollToItem(index) {
    const container = document.querySelector('.scroll-wrapper');
    const items = container.querySelectorAll('.work-box');
    const item = items[index];
    container.scrollTo({ left: item.offsetLeft - 10, behavior: 'smooth' });
    updateDots(index);
  }

  window.scrollToItem = scrollToItem;

  function updateDots(activeIndex) {
    const dots = document.querySelectorAll('.dots-indicator .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  const scrollContainer = document.querySelector('.scroll-wrapper');
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
      const items = document.querySelectorAll('.work-box');
      let index = 0;
      let minDiff = Infinity;
      items.forEach((item, i) => {
        const diff = Math.abs(scrollContainer.scrollLeft - item.offsetLeft);
        if (diff < minDiff) {
          minDiff = diff;
          index = i;
        }
      });
      updateDots(index);
    });
  }
});

  /*--------------------  Reservation Form --------------------*/
  const bookingForm = document.getElementById("bookingForm");
  const bookingSubmitButton = document.getElementById("submit-button");
  const bookingMessageDiv = document.getElementById("bookingMessage");

  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    bookingMessageDiv.textContent =
      "در حال ارسال اطلاعات . . . لطفا صبر کنید  . . . ";
    bookingMessageDiv.style.display = "block";
    bookingMessageDiv.style.backgroundColor = "beige";
    bookingMessageDiv.style.color = "black";
    bookingSubmitButton.disabled = true;
    bookingSubmitButton.classList.add("is-loading");

    try {
      const formData = new FormData(this);
      const formDataObj = {};

      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbw015nvs-FDAPGZ2o1bpdhTSAS3IdLqCznxVDTJ6cdRmsI0b07dHxMw7lBcxmt0SphM/exec";

      const response = await fetch(scriptURL, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(formDataObj),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        bookingMessageDiv.textContent =
          data.message || "اطلاعات با موفقیت ارسال شد!";
        bookingMessageDiv.style.backgroundColor = "#48c78e";
        bookingMessageDiv.style.color = "white";
        bookingForm.reset();
      } else {
        throw new Error(data.message || "خطا در ارسال اطلاعات");
      }
    } catch (error) {
      console.error("Error:", error);
      bookingMessageDiv.textContent = "خطا: " + error.message;
      bookingMessageDiv.style.backgroundColor = "#f14668";
      bookingMessageDiv.style.color = "white";
    } finally {
      bookingSubmitButton.disabled = false;
      bookingSubmitButton.classList.remove("is-loading");

      setTimeout(() => {
        bookingMessageDiv.textContent = "";
        bookingMessageDiv.style.display = "none";
      }, 4000);
    }
  });



  /*--------------------  گرفتن دیتا در فرم HTML و پر کردن دراپ‌داون‌ها --------------------*/

  let availableData = {};

// گرفتن اطلاعات از Google Apps Script
fetch('https://script.google.com/macros/s/AKfycbw015nvs-FDAPGZ2o1bpdhTSAS3IdLqCznxVDTJ6cdRmsI0b07dHxMw7lBcxmt0SphM/exec')
  .then(response => response.json())
  .then(data => {
    availableData = data;
    populateDates(); // بعد از گرفتن دیتا، لیست تاریخ‌ها رو پر کن
  })
  .catch(error => console.error("خطا در گرفتن اطلاعات:", error));

// تعریف تابع populateDates به صورت global
window.populateDates = function() {
  const dateSelect = document.getElementById("date");
  dateSelect.innerHTML = '<option value="">لیست تاریخ‌های موجود</option>';

  for (let date in availableData) {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  }
}

// تعریف تابع populateTimes به صورت global
window.populateTimes = function() {
  const dateSelect = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const selectedDate = dateSelect.value;

  timeSelect.innerHTML = '<option value="">چه ساعتی؟</option>';

  if (availableData[selectedDate]) {
    availableData[selectedDate].forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });
  }
}


  /*--------------------  Contact Form --------------------*/

  const contactForm = document.getElementById("contactForm");
  const contactSubmitButton = document.getElementById("submit-button");
  const contactMessageDiv = document.getElementById("contactMessage");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    contactMessageDiv.textContent =
      "در حال ارسال پیام . . . لطفا صبر کنید  . . . ";
    contactMessageDiv.style.display = "block";
    contactMessageDiv.style.backgroundColor = "beige";
    contactMessageDiv.style.color = "black";
    contactSubmitButton.disabled = true;
    contactSubmitButton.classList.add("is-loading");

    try {
      const formData = new FormData(this);
      const formDataObj = {};

      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbw015nvs-FDAPGZ2o1bpdhTSAS3IdLqCznxVDTJ6cdRmsI0b07dHxMw7lBcxmt0SphM/exec";

      const response = await fetch(scriptURL, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(formDataObj),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        contactMessageDiv.textContent =
          data.message || "پیام شما با موفقیت ارسال شد!";
        contactMessageDiv.style.backgroundColor = "#48c78e";
        contactMessageDiv.style.color = "white";
        contactForm.reset();
      } else {
        throw new Error(data.message || "خطا در ارسال پیام");
      }
    } catch (error) {
      console.error("Error:", error);
      contactMessageDiv.textContent = "خطا: " + error.message;
      contactMessageDiv.style.backgroundColor = "#f14668";
      contactMessageDiv.style.color = "white";
    } finally {
      contactSubmitButton.disabled = false;
      contactSubmitButton.classList.remove("is-loading");

      setTimeout(() => {
        contactMessageDiv.textContent = "";
        contactMessageDiv.style.display = "none";
      }, 4000);
    }
  });

  /*-------------------- Back to top button --------------------*/
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }
})();
