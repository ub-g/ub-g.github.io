(function () {
    "use strict";

    var MAX_RESULTS = 8;
    var debounceTimer = null;
    var activeIndex = -1;
    var currentMatches = [];

    var searchIcon = '<svg class="ubg-search__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function highlightMatch(name, query) {
        var lowerName = name.toLowerCase();
        var index = lowerName.indexOf(query);
        if (index === -1) return escapeHtml(name);
        return (
            escapeHtml(name.slice(0, index)) +
            "<mark>" + escapeHtml(name.slice(index, index + query.length)) + "</mark>" +
            escapeHtml(name.slice(index + query.length))
        );
    }

    function getGames() {
        return typeof gamesList !== "undefined" ? gamesList : [];
    }

    function filterGames(query) {
        if (!query) return [];
        var games = getGames();
        var lowerQuery = query.toLowerCase();
        var startsWith = [];
        var includes = [];

        games.forEach(function (game) {
            var name = game.name.trim();
            var lowerName = name.toLowerCase();
            if (lowerName.startsWith(lowerQuery)) {
                startsWith.push(game);
            } else if (lowerName.includes(lowerQuery)) {
                includes.push(game);
            }
        });

        return startsWith.concat(includes).slice(0, MAX_RESULTS);
    }

    function buildSearchMarkup(extraClass) {
        return (
            '<div class="ubg-search ' + (extraClass || "") + '" id="ubg-search">' +
                '<form class="ubg-search__form" role="search" autocomplete="off">' +
                    searchIcon +
                    '<input type="search" class="ubg-search__input" placeholder="Search games..." aria-label="Search games" autocomplete="off" spellcheck="false" />' +
                    '<button type="button" class="ubg-search__clear" aria-label="Clear search">&times;</button>' +
                    '<kbd class="ubg-search__kbd">Ctrl K</kbd>' +
                '</form>' +
                '<div class="ubg-search__dropdown" role="listbox" aria-label="Search results"></div>' +
            '</div>'
        );
    }

    function initSearchContainer(container, isOverlay) {
        if (!container || container.dataset.ubgSearchInit) return;
        container.dataset.ubgSearchInit = "1";

        var root = container.querySelector(".ubg-search") || container;
        var form = root.querySelector(".ubg-search__form");
        var input = root.querySelector(".ubg-search__input");
        var dropdown = root.querySelector(".ubg-search__dropdown");
        var clearBtn = root.querySelector(".ubg-search__clear");

        function closeDropdown() {
            dropdown.classList.remove("is-open");
            activeIndex = -1;
        }

        function openDropdown() {
            if (dropdown.innerHTML) dropdown.classList.add("is-open");
        }

        function renderResults(matches, query) {
            currentMatches = matches;
            activeIndex = -1;

            if (!query) {
                dropdown.innerHTML = "";
                closeDropdown();
                clearBtn.classList.remove("is-visible");
                return;
            }

            clearBtn.classList.add("is-visible");

            if (matches.length === 0) {
                dropdown.innerHTML = '<div class="ubg-search__empty">No games found for "' + escapeHtml(query) + '"</div>';
                openDropdown();
                return;
            }

            var html = '<div class="ubg-search__count">' + matches.length + (matches.length === MAX_RESULTS ? "+" : "") + ' results</div>';
            html += matches.map(function (game, i) {
                var thumb = game.img
                    ? '<img class="ubg-search__result-thumb" src="' + escapeHtml(game.img) + '" alt="" loading="lazy" />'
                    : '<span class="ubg-search__result-fallback">' + escapeHtml(game.name.trim().charAt(0).toUpperCase()) + '</span>';
                return (
                    '<a href="' + escapeHtml(game.url) + '" class="ubg-search__result" role="option" data-index="' + i + '">' +
                        '<span class="ubg-search__result-icon">' + thumb + '</span>' +
                        '<span class="ubg-search__result-label">' + highlightMatch(game.name.trim(), query) + '</span>' +
                    '</a>'
                );
            }).join("");

            dropdown.innerHTML = html;
            openDropdown();
        }

        function runSearch() {
            var query = input.value.trim().toLowerCase();
            renderResults(filterGames(query), query);
        }

        function setActive(index) {
            var items = dropdown.querySelectorAll(".ubg-search__result");
            items.forEach(function (el) { el.classList.remove("is-active"); });
            if (index >= 0 && index < items.length) {
                items[index].classList.add("is-active");
                items[index].scrollIntoView({ block: "nearest" });
            }
            activeIndex = index;
        }

        input.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runSearch, 150);
        });

        input.addEventListener("focus", function () {
            if (input.value.trim()) runSearch();
        });

        input.addEventListener("keydown", function (e) {
            var items = dropdown.querySelectorAll(".ubg-search__result");
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive(Math.min(activeIndex + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive(Math.max(activeIndex - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (activeIndex >= 0 && items[activeIndex]) {
                    window.location.href = items[activeIndex].getAttribute("href");
                } else if (currentMatches[0]) {
                    window.location.href = currentMatches[0].url;
                }
            } else if (e.key === "Escape") {
                input.value = "";
                closeDropdown();
                clearBtn.classList.remove("is-visible");
                if (isOverlay) closeOverlay();
                else input.blur();
            }
        });

        clearBtn.addEventListener("click", function () {
            input.value = "";
            closeDropdown();
            clearBtn.classList.remove("is-visible");
            input.focus();
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (currentMatches[0]) window.location.href = currentMatches[0].url;
        });

        document.addEventListener("click", function (e) {
            if (!root.contains(e.target)) closeDropdown();
        });
    }

    function closeOverlay() {
        var overlay = document.getElementById("ubg-search-overlay");
        if (overlay) {
            overlay.classList.remove("is-open");
            document.body.style.overflow = "";
        }
    }

    function openOverlay() {
        var overlay = document.getElementById("ubg-search-overlay");
        if (!overlay) return;
        overlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
        var input = overlay.querySelector(".ubg-search__input");
        if (input) setTimeout(function () { input.focus(); }, 50);
    }

    function injectSearch() {
        if (document.getElementById("ubg-search")) return;

        var navContainer = document.querySelector("header nav .container");
        if (!navContainer) return;

        var navDropdown = document.getElementById("navbar-dropdown");
        var searchEl = document.createElement("div");
        searchEl.innerHTML = buildSearchMarkup("ubg-search--header");
        var searchNode = searchEl.firstElementChild;

        if (navDropdown) {
            navContainer.insertBefore(searchNode, navDropdown);
        } else {
            navContainer.appendChild(searchNode);
        }

        initSearchContainer(searchNode);

        var mobileActions = navContainer.querySelector(".flex.gap-2.lg\\:hidden");
        if (mobileActions) {
            var mobileBtn = document.createElement("button");
            mobileBtn.type = "button";
            mobileBtn.className = "ubg-search-mobile-btn";
            mobileBtn.setAttribute("aria-label", "Open search");
            mobileBtn.innerHTML = searchIcon;
            mobileBtn.addEventListener("click", openOverlay);
            mobileActions.insertBefore(mobileBtn, mobileActions.firstChild);
        }

        var overlay = document.createElement("div");
        overlay.id = "ubg-search-overlay";
        overlay.className = "ubg-search-overlay";
        overlay.innerHTML = buildSearchMarkup("");
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeOverlay();
        });
        document.body.appendChild(overlay);
        initSearchContainer(overlay.querySelector(".ubg-search"), true);
    }

    document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            if (window.innerWidth < 768) {
                openOverlay();
            } else {
                var input = document.querySelector(".ubg-search--header .ubg-search__input");
                if (input) input.focus();
            }
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectSearch);
    } else {
        injectSearch();
    }
})();
