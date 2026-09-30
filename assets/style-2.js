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

        const funLine = document.getElementById("fun-line");
        const funTemplate = document.getElementById("fun-lines");
        if (funLine && funTemplate) {
            const lines = Array.from(funTemplate.content.children).map((node) => ({
                html: node.innerHTML,
            }));
            let index = Math.floor(Math.random() * lines.length);
            let timer = null;
            const stubSrc = "images/fun/stub.svg";
            const lightbox = document.getElementById("fun-lightbox");
            const lightboxImg = document.getElementById("fun-lightbox-img");

            const showLine = (nextIndex) => {
                funLine.classList.add("is-leaving");
                window.setTimeout(() => {
                    index = (nextIndex + lines.length) % lines.length;
                    funLine.innerHTML = lines[index].html;
                    funLine.classList.remove("is-leaving");
                    funLine.classList.add("is-entering");
                    window.setTimeout(() => funLine.classList.remove("is-entering"), 420);
                }, 220);
            };

            const schedule = () => {
                window.clearInterval(timer);
                timer = window.setInterval(() => showLine(index + 1), 4200);
            };

            const openLightbox = (href, label) => {
                if (!lightbox || !lightboxImg) return;
                lightboxImg.onerror = () => {
                    lightboxImg.onerror = null;
                    lightboxImg.src = stubSrc;
                };
                lightboxImg.src = href;
                lightboxImg.alt = label ? `Photo: ${label}` : "Photo";
                lightbox.hidden = false;
                lightbox.classList.add("is-open");
                document.body.classList.add("fun-lightbox-open");
                window.clearInterval(timer);
            };

            const closeLightbox = () => {
                if (!lightbox) return;
                lightbox.classList.remove("is-open");
                lightbox.hidden = true;
                document.body.classList.remove("fun-lightbox-open");
                schedule();
            };

            funLine.innerHTML = lines[index].html;
            funLine.classList.add("is-entering");
            window.setTimeout(() => funLine.classList.remove("is-entering"), 420);
            schedule();

            funLine.addEventListener("click", (event) => {
                const word = event.target.closest("a.fun-word");
                if (word) {
                    event.preventDefault();
                    event.stopPropagation();
                    openLightbox(word.getAttribute("href"), word.textContent.trim());
                    return;
                }
                if (event.target.closest("a.fun-home")) {
                    event.stopPropagation();
                    return;
                }
                showLine(index + 1);
                schedule();
            });

            document.querySelector(".fun-stage")?.addEventListener("click", (event) => {
                if (
                    event.target.closest("a.fun-word") ||
                    event.target.closest("a.fun-support") ||
                    event.target.closest("a.fun-home") ||
                    event.target.closest("#fun-line")
                ) {
                    return;
                }
                showLine(index + 1);
                schedule();
            });

            lightbox?.querySelector(".fun-lightbox-close")?.addEventListener("click", closeLightbox);
            lightbox?.addEventListener("click", (event) => {
                if (event.target === lightbox) closeLightbox();
            });
            document.addEventListener("keydown", (event) => {
                if (!document.body.classList.contains("fun-page")) return;
                if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
                    closeLightbox();
                } else if ((event.key === "ArrowRight" || event.key === " ") && !lightbox?.classList.contains("is-open")) {
                    event.preventDefault();
                    showLine(index + 1);
                    schedule();
                } else if (event.key === "ArrowLeft" && !lightbox?.classList.contains("is-open")) {
                    event.preventDefault();
                    showLine(index - 1);
                    schedule();
                }
            });
        }
    });

    media.addEventListener("change", (event) => {
        if (!localStorage.getItem(storageKey)) {
            setTheme(event.matches ? "dark" : "light");
        }
    });
})();
