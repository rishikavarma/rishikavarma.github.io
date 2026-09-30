(() => {
    const storageKey = "rishika-theme";
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem(storageKey);

    const setTheme = (theme) => {
        root.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute(
            "content",
            theme === "dark" ? "#100b0e" : "#fff8fa"
        );

        const button = document.querySelector(".theme-toggle");
        if (!button) return;

        const nextTheme = theme === "dark" ? "light" : "dark";
        button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
        button.setAttribute("title", `Switch to ${nextTheme} mode`);
        button.querySelector(".theme-toggle-label").textContent = theme;
    };

    setTheme(savedTheme || (media.matches ? "dark" : "light"));

    document.addEventListener("DOMContentLoaded", () => {
        const button = document.createElement("button");
        button.className = "theme-toggle";
        button.type = "button";
        button.innerHTML = `
            <span class="theme-toggle-icon" aria-hidden="true"></span>
            <span class="theme-toggle-label"></span>
        `;
        document.body.appendChild(button);
        setTheme(root.dataset.theme);

        button.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            localStorage.setItem(storageKey, nextTheme);
            setTheme(nextTheme);
        });

        const newsList = document.querySelector(".news-list");
        const newsToggle = document.querySelector(".news-toggle");
        if (newsList && newsToggle) {
            newsToggle.addEventListener("click", () => {
                const expanded = newsList.classList.toggle("is-expanded");
                newsToggle.setAttribute("aria-expanded", String(expanded));
                newsToggle.textContent = expanded ? "Show less" : "Show more";
            });
        }
    });

    media.addEventListener("change", (event) => {
        if (!localStorage.getItem(storageKey)) {
            setTheme(event.matches ? "dark" : "light");
        }
    });
})();
