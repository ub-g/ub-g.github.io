document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const showAllBtn = document.getElementById("show-all-btn");

    // For the search results page
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") ? params.get("q").trim().toLowerCase() : "";

    if (searchResults) {
        displayGames(query);
    }

    // Handle search form submit
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const term = searchInput.value.trim();
            if (term.length > 0) {
                window.location.href = `search.html?q=${encodeURIComponent(term)}`;
            }
        });
    }

    // Show all games button
    if (showAllBtn) {
        showAllBtn.addEventListener("click", function () {
            window.location.href = "search.html?q=*"; // Special case: show all
        });
    }

    // Function to filter and display games
    function displayGames(searchTerm) {
        const getTitle = document.querySelectorAll(".list-game .list-title");
        let matchedGames = [];

        getTitle.forEach(titleEl => {
            let title = titleEl.textContent.trim();
            let titleLower = title.toLowerCase();
            let gameLink = titleEl.parentElement.getAttribute("href");

            if (searchTerm === "*" || titleLower.startsWith(searchTerm)) {
                matchedGames.push({ link: gameLink, title: title });
            }
        });

        if (matchedGames.length === 0) {
            searchResults.innerHTML = "<p>No games found.</p>";
            return;
        }

        searchResults.innerHTML = matchedGames.map(game =>
            `<a href="${game.link}" class="search-result-item">
                <span>${game.title}</span>
            </a>`
        ).join("");
    }
});
