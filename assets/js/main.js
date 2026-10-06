(() => {
  const root = document.documentElement;
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");

  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const isDark = root.dataset.theme ? root.dataset.theme === "dark" : darkQuery.matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 4);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  new IntersectionObserver(([entry]) => {
    nav.classList.toggle("show-name", !entry.isIntersecting);
  }, { rootMargin: "-56px 0px 0px 0px" }).observe(document.querySelector(".hero h1"));

  const links = [...document.querySelectorAll(".nav-links a")];
  const indicator = document.querySelector(".nav-indicator");
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  const visible = new Set();

  const setActive = (link) => {
    links.forEach((a) => a.classList.toggle("is-active", a === link));
    if (!link) {
      indicator.style.opacity = "0";
      return;
    }
    indicator.style.opacity = "1";
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    const strip = link.parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: link.offsetLeft - strip.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
    }
  };

  const updateActive = () => {
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    const index = atBottom ? sections.length - 1 : sections.findIndex((s) => visible.has(s));
    setActive(links[index]);
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    updateActive();
  }, { rootMargin: "-35% 0px -60% 0px" });
  sections.forEach((s) => sectionObserver.observe(s));
  addEventListener("scroll", updateActive, { passive: true });
  addEventListener("resize", updateActive);

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealObserver.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox.querySelector("img");
  document.querySelectorAll("button.pub-fig").forEach((button) => {
    button.addEventListener("click", () => {
      const img = button.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });
})();
