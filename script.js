// HERO SLIDESHOW
let hideTimer = null;
let heroIdx = 0;
const heroSlides = document.querySelectorAll(".slide");
const dotsWrap = document.getElementById("heroDots");
heroSlides.forEach((_, i) => {
  const d = document.createElement("button");
  if (i === 0) d.classList.add("on");
  d.onclick = () => {
    heroIdx = i;
    showHero();
  };
  dotsWrap.appendChild(d);
});
function showHero() {
  heroSlides.forEach((s) => s.classList.remove("active"));
  dotsWrap.querySelectorAll("button").forEach((d) => d.classList.remove("on"));
  heroSlides[heroIdx].classList.add("active");
  dotsWrap.querySelectorAll("button")[heroIdx].classList.add("on");
}
function heroSlide(dir) {
  heroIdx = (heroIdx + dir + heroSlides.length) % heroSlides.length;
  showHero();
}
setInterval(() => heroSlide(1), 5000);

// CAROUSELS
const carState = {};

function initCar(id) {
  const track = document.getElementById(id + "Track");
  const cards = Array.from(track.querySelectorAll(".biz-card"));
  carState[id] = { pos: 0, visible: getVisible(), total: cards.length };
  updateCarBtns(id);
}

function getVisible() {
  return window.innerWidth < 700 ? 2 : window.innerWidth < 1100 ? 3 : 4;
}

function carMove(id, dir) {
  const st = carState[id];
  const visible = getVisible();

  const track = document.getElementById(id + "Track");
  const cards = Array.from(track.querySelectorAll(".biz-card")).filter(
    (card) => getComputedStyle(card).display !== "none",
  );

  const maxPos = Math.max(0, cards.length - visible);

  st.pos = Math.min(maxPos, Math.max(0, st.pos + dir));

  applyCarTransform(id, cards);
  updateCarBtns(id);
}

function applyCarTransform(id, cards) {
  const track = document.getElementById(id + "Track");
  const st = carState[id];

  if (!cards) {
    cards = Array.from(
      track.querySelectorAll('.biz-card:not([style*="none"])'),
    );
  }

  if (!cards.length) return;

  // Measure the real distance between cards
  const first = cards[0];
  const second = cards[1];

  let step = first.offsetWidth;

  if (second) {
    step = second.offsetLeft - first.offsetLeft;
  }

  track.style.transform = `translateX(-${st.pos * step}px)`;
}

function updateCarBtns(id) {
  const st = carState[id];
  const visible = getVisible();

  const track = document.getElementById(id + "Track");
  const cards = Array.from(track.querySelectorAll(".biz-card")).filter(
    (card) => getComputedStyle(card).display !== "none",
  );

  const maxPos = Math.max(0, cards.length - visible);

  document.getElementById(id + "Prev").disabled = st.pos === 0;
  document.getElementById(id + "Next").disabled = st.pos >= maxPos;
}

// TAB FILTERING
function setupTabs(tabsId, carId) {
  const tabs = document.querySelectorAll("#" + tabsId + " button");
  const track = document.getElementById(carId + "Track");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("on"));
      tab.classList.add("on");
      const cat = tab.dataset.cat;
      Array.from(track.querySelectorAll(".biz-card")).forEach((card) => {
        card.style.display =
          cat === "all" || card.dataset.cat === cat ? "" : "none";
      });
      carState[carId].pos = 0;
      track.style.transform = "translateX(0)";
      updateCarBtns(carId);
    });
  });
}

// ── CONTACT NAV BUTTON ───────────────────────
document.getElementById("contactBtn").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

// ── HAMBURGER ────────────────────────────────
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");
  document.body.style.overflow = mobileNav.classList.contains("open")
    ? "hidden"
    : "";
});
function closeMobileNav() {
  hamburger.classList.remove("open");
  mobileNav.classList.remove("open");
  document.body.style.overflow = "";
}

const formPopup = document.createElement("div");
formPopup.className = "formPopup";
formPopup.innerHTML = `
      <div class="contact-box">
      <button class="closeForm">&times;</button>
        <h2>Contact us</h2>
        <p class="sub">
          Have a question about buying or selling? Our team will get back to
          you.  
        </p>
        <form
          onsubmit="
            event.preventDefault();
            this.innerHTML =
              '<p style=\'color:green;font-weight:700;padding:24px 0\'>✓ Message sent! We\'ll be in touch shortly.</p>';
          "
        >
          <div class="fgrid">
            <div class="frow">
              <label>First name</label><input type="text" required />
            </div>
            <div class="frow">
              <label>Last name</label><input type="text" required />
            </div>
          </div>
          <div class="frow">
            <label>Email address</label><input type="email" required />
          </div>
          <div class="frow">
            <label>Phone number</label><input type="tel" />
          </div>
          <div class="frow">
            <label>I'm contacting about</label>
            <select id="contactReason">
            </select>
          </div>
          <div class="frow">
            <label>Message</label><textarea required></textarea>
          </div>
          <button
            type="submit"
            class="btn btn-purple"
            style="width: 100%; padding: 13px; font-size: 16px"
          >
            Send message
          </button>
        </form>
      </div>`;
document.body.appendChild(formPopup);
// ── HOVER POPUP ──────────────────────────────
const popup = document.createElement("div");
popup.className = "popup";
popup.innerHTML = `
              <div class="popup-title" id="pt"></div>
              <div class="popup-updated" id="pu"></div>
              <div class="popup-badges" id="pb"></div>
              <ul class="popup-highlights" id="ph"></ul>
              <div class="popup-stats" id="ps"></div>
              <div id="pp"></div>
              <button class="popup-cta" onclick="openContactForm();">
  Contact us about this business
</button>
            `;
document.body.appendChild(popup);

let popupTimer = null;
let activeCard = null;

function showPopup(card) {
  activeCard = card;
  const d = card.dataset;
  document.getElementById("pt").textContent = d.title;
  formPopup.dataset.business = d.title;
  document.getElementById("pu").textContent =
    `📍 ${d.location} · Est. ${d.est} · ${d.staff}`;

  // badges
  const badgeClass = d.badge === "hot" ? "hot" : "";
  document.getElementById("pb").innerHTML = `
                <span class="badge ${badgeClass}">${d.badgeText}</span>
                <span class="star-pill"><span class="s">★</span>${d.rating}</span>
                `;

  // highlights
  document.getElementById("ph").innerHTML = [d.h1, d.h2, d.h3, d.h4]
    .map((h) => `<li>${h}</li>`)
    .join("");

  // stats
  document.getElementById("ps").innerHTML = `
                <div><div class="popup-stat-label">Annual Revenue</div><div class="popup-stat-value">${d.revenue}</div></div>
                <div><div class="popup-stat-label">Net Profit</div><div class="popup-stat-value">${d.profit}</div></div>`;

  // price
  const priceEl = document.getElementById("pp");
  if (d.price) {
    priceEl.innerHTML = `<div class="popup-price-row">
                  <span class="popup-price">${d.price}</span>
                  ${d.orig ? `<span class="popup-orig">${d.orig}</span>` : ""}
                </div>`;
  } else {
    priceEl.innerHTML = `<p class="popup-no-price">Price on enquiry</p>`;
  }

  // position popup
  popup.className = "popup";
  popup.style.visibility = "hidden";
  popup.style.display = "block";

  const rect = card.getBoundingClientRect();

  const popW = 320;
  const margin = 12;

  popup.style.display = "block";
  popup.style.visibility = "hidden";

  const popH = popup.offsetHeight;

  let left;
  let top = rect.top + (rect.height - popH) / 2;

  const spaceRight = window.innerWidth - rect.right;
  const spaceLeft = rect.left;

  if (spaceRight >= popW + margin) {
    left = rect.right + margin;
    popup.classList.add("pop-right");
  } else if (spaceLeft >= popW + margin) {
    left = rect.left - popW - margin;
    popup.classList.add("pop-left");
  } else {
    left = Math.max(10, rect.left - (popW - rect.width) / 2);
  }

  top = Math.max(10, Math.min(top, window.innerHeight - popH - 10));

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  popup.style.visibility = "visible";
  popup.classList.add("visible");
}

function hidePopup() {
  popup.classList.remove("visible");
  popup.style.display = "none";
}

function updatePopupPosition() {
  if (!activeCard || popup.style.display === "none") return;

  const rect = activeCard.getBoundingClientRect();

  const popW = popup.offsetWidth;
  const popH = popup.offsetHeight;
  const margin = 12;

  let left;
  let top = rect.top + (rect.height - popH) / 2;

  if (window.innerWidth - rect.right >= popW + margin) {
    left = rect.right + margin;
  } else {
    left = rect.left - popW - margin;
  }

  top = Math.max(10, Math.min(top, window.innerHeight - popH - 10));

  popup.style.left = left + "px";
  popup.style.top = top + "px";

  // Hide only when the card has completely left the screen
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    hidePopup();
  }
}
// document.querySelectorAll(".biz-card").forEach((card) => {
//   if (card.closest("#our-businesses")) return;
//   card.addEventListener("mouseenter", () => {
//     clearTimeout(hideTimer);
//     clearTimeout(popupTimer);

//     if (window.innerWidth <= 900) return;

//     activeCard = card;
//     popupTimer = setTimeout(() => {
//       showPopup(card);
//     }, 300);
//   });

//   card.addEventListener("mouseleave", () => {
//     clearTimeout(popupTimer);

//     hideTimer = setTimeout(() => {
//       hidePopup();
//     }, 250);
//   });
// });

document.querySelectorAll(".biz-card").forEach((card) => {
  if (card.closest("#our-businesses")) return;

  // Desktop
  card.addEventListener("mouseenter", () => {
    if (window.innerWidth <= 900) return;

    clearTimeout(hideTimer);
    clearTimeout(popupTimer);

    activeCard = card;

    popupTimer = setTimeout(() => {
      showPopup(card);
    }, 300);
  });

  card.addEventListener("mouseleave", () => {
    if (window.innerWidth <= 900) return;

    clearTimeout(popupTimer);

    hideTimer = setTimeout(() => {
      hidePopup();
    }, 250);
  });

  // Mobile
  card.addEventListener("click", () => {
    if (window.innerWidth > 900) return;

    showPopup(card);
  });
});

popup.addEventListener("mouseenter", () => {
  clearTimeout(hideTimer);
});

popup.addEventListener("mouseleave", () => {
  hidePopup();
});

// INIT
window.addEventListener("load", () => {
  initCar("nl");
  initCar("fb");
  initCar("io");
  initCar("ob");
  // setupTabs("nlTabs", "nl");
  // setupTabs("fbTabs", "fb");
});
window.addEventListener("resize", () => {
  ["nl", "fb", "io", "ob"].forEach((id) => {
    if (carState[id]) {
      carState[id].pos = 0;
      document.getElementById(id + "Track").style.transform = "translateX(0)";
      updateCarBtns(id);
    }
  });
});

document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;

    item.classList.toggle("active");

    const content = item.querySelector(".accordion-content");

    if (item.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = "0";
    }
  });
});

function openContactForm() {
  formPopup.classList.add("show");

  const select = formPopup.querySelector("#contactReason");

  if (select && formPopup.dataset.business) {
    // Create an option for this business if it doesn't exist
    let option = [...select.options].find(
      (o) => o.value === formPopup.dataset.business,
    );

    if (!option) {
      option = new Option(
        formPopup.dataset.business,
        formPopup.dataset.business,
      );
      select.prepend(option);
    }

    select.value = formPopup.dataset.business;
  }

  hidePopup();
}

formPopup.querySelector(".closeForm").onclick = () => {
  formPopup.classList.remove("show");
};

window.addEventListener("scroll", updatePopupPosition, { passive: true });
window.addEventListener("resize", updatePopupPosition);

(function () {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".hero__carousel-slide"));
  const dotsWrap = carousel.querySelector("[data-carousel-dots]");
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "hero__carousel-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    resetTimer();
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", resetTimer);

  resetTimer();
})();
