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

const photoLinks = document.querySelectorAll("[data-photo]");
if (photoLinks.length && "HTMLDialogElement" in window) {
  const dialog = document.createElement("dialog");
  dialog.className = "photo-dialog";
  dialog.setAttribute("aria-labelledby", "photo-dialog-title");
  dialog.innerHTML = `
    <div class="photo-dialog-content">
      <div class="photo-dialog-heading">
        <h2 id="photo-dialog-title"></h2>
        <form method="dialog">
          <button type="submit" aria-label="Close photo" autofocus>×</button>
        </form>
      </div>
      <img alt="">
    </div>
  `;
  document.body.append(dialog);

  const title = dialog.querySelector("h2");
  const photo = dialog.querySelector("img");

  for (const link of photoLinks) {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      title.textContent = link.getAttribute("aria-label");
      photo.alt = link.querySelector("img").alt;
      photo.src = link.href;
      dialog.showModal();
    });
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
