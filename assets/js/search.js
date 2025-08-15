document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    // Prevent default form submit
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    // Trigger search on typing
    searchInput.addEventListener("input", function () {
        getDataGame();
    });

    function getDataGame() {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length < 1) {
            searchResults.innerHTML = "";
            searchResults.style.display = "none";
            return;
        }

        // Get all game titles
        const getTitle = document.querySelectorAll(".list-game .list-title");
        let matchedGames = [];

        getTitle.forEach(titleEl => {
            let title = titleEl.textContent.trim();
            let titleLower = title.toLowerCase();
            let gameLink = titleEl.parentElement.getAttribute("href");

            // Match only if the title starts with query
            if (titleLower.startsWith(query)) {
                matchedGames.push({
                    link: gameLink,
                    title: title
                });
            }
        });

        displayResults(matchedGames);
    }

    function displayResults(games) {
        if (games.length === 0) {
            searchResults.innerHTML = '<p class="no-results text-gray-500 p-2">No games found</p>';
            searchResults.style.display = "block";
            return;
        }

        let html = games.map(game => 
            `<a href="${game.link}" class="search-result-item">
                <span>${game.title}</span>
            </a>`
        ).join("");

        searchResults.innerHTML = html;
        searchResults.style.display = "block";
    }

    // Hide results when clicking outside search form
    document.addEventListener("click", function (e) {
        if (!searchForm.contains(e.target)) {
            searchResults.style.display = "none";
        }
    });
});
