
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 1. Loading animation
window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("hidden"), 500);
});

// 2. Typing animation
const typingText = $("#typingText");
const phrases = [
  "Diploma Engineering Student",
  "Electronics Engineering Student",
  "Aspiring Engineer",
  "Future Innovator"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typingText) return;

  const phrase = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typingText.textContent = phrase.slice(0, charIndex);

    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(typeEffect, 1400);
      return;
    }
  } else {
    charIndex--;
    typingText.textContent = phrase.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeEffect, deleting ? 35 : 70);
}

typeEffect();

// 3. Mobile navigation
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.textContent = open ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// 4. Dark and light theme
const themeToggle = $("#themeToggle");

if (localStorage.getItem("samyak-theme") === "dark") {
  document.body.classList.add("dark");
}

function updateThemeIcon() {
  if (!themeToggle) return;

  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀"
    : "☾";
}

updateThemeIcon();

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "samyak-theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );

  updateThemeIcon();
});

// 5. Reveal elements while scrolling
const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// 6. Animate skill bars when the skills section appears
const skillsSection = $("#skills");

if (skillsSection && "IntersectionObserver" in window) {
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillsSection.querySelectorAll(".skill-track span").forEach((bar) => {
          bar.style.width = bar.dataset.width || "0%";
        });

        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  skillObserver.observe(skillsSection);
} else {
  $$(".skill-track span").forEach((bar) => {
    bar.style.width = bar.dataset.width || "0%";
  });
}

// 7. Interactive 3D photo card on desktop
const photoCard = $(".photo-card");
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (photoCard && canTilt) {
  photoCard.addEventListener("mousemove", (event) => {
    const rect = photoCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 10;

    photoCard.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  photoCard.addEventListener("mouseleave", () => {
    photoCard.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

// 8. Highlight the current navigation section
const sections = $$("main section[id]");
const navItems = navLinks?.querySelectorAll('a[href^="#"]') || [];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

// 9. Contact form opens the user's email application
$("#contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#visitorName").value.trim();
  const email = $("#visitorEmail").value.trim();
  const message = $("#visitorMessage").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href =
    `mailto:samyaktapal031008@gmail.com?subject=${subject}&body=${body}`;
});

// 10. Copy project objective
$("#copyPrompt")?.addEventListener("click", async () => {
  const text = "Create a responsive personal portfolio website using HTML, CSS and JavaScript. Include a professional white design, profile photo, education timeline, technical skills, achievements, hobbies and contact section.";

  try {
    await navigator.clipboard.writeText(text);
    $("#copyPrompt").textContent = "Copied successfully ✓";
  } catch {
    window.prompt("Copy this project objective:", text);
  }
});

// 11. Back-to-top button
const backToTop = $("#backToTop");

window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 12. Current year in footer
$("#currentYear").textContent = new Date().getFullYear();
