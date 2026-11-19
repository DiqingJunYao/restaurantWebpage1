const year = String(new Date().getFullYear());
for (const date of document.querySelectorAll("[data-current-year]")) {
  date.dateTime = year;
  date.textContent = year;
  date.hidden = false;
}

const header = document.querySelector(".site-header");
if (header && "ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  });
  resizeObserver.observe(header, { box: "border-box" });
}

const filters = document.querySelector("[data-menu-filters]");
if (filters) {
  const buttons = filters.querySelectorAll("button[data-filter]");
  const status = filters.querySelector("[role='status']");
  const dishes = document.querySelectorAll("[data-dish-tags]");
  const sectionLinks = document.querySelectorAll(".menu-nav a");

  function filterMenu(activeButton) {
    const filter = activeButton.dataset.filter;
    let visibleCount = 0;

    for (const dish of dishes) {
      const matches = filter === "all" || dish.matches(`[data-dish-tags~="${filter}"]`);
      dish.hidden = !matches;
      if (matches) visibleCount++;
    }

    for (const link of sectionLinks) {
      const section = document.getElementById(link.hash.slice(1));
      section.hidden = !section.querySelector("[data-dish-tags]:not([hidden])");
      link.hidden = section.hidden;
    }

    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button === activeButton));
    }

    status.textContent = `Showing ${visibleCount} of ${dishes.length} menu items`;
  }

  for (const button of buttons) {
    button.addEventListener("click", () => filterMenu(button));
  }

  filterMenu(filters.querySelector("[data-filter='all']"));
  filters.hidden = false;
}
