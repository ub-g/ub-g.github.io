// search.js
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    searchInput.addEventListener("focus", getDataGame);
    searchInput.addEventListener("input", getDataGame);

    function getDataGame() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 1) {
            searchResults.innerHTML = "";
            searchResults.style.display = "none";
            return;
        }

        const matchedGames = gamesList.filter(game =>
            game.title.toLowerCase().includes(query)
        );

        displayResults(matchedGames);
    }

    function displayResults(games) {
        if (games.length === 0) {
            searchResults.innerHTML = '<p class="no-results text-gray-500 p-2">No games found</p>';
            searchResults.style.display = "block";
            return;
        }

        let html = games.map(game => `
            <a href="${game.link}" class="search-result-item">
                <span>${game.title}</span>
            </a>
        `).join("");

        searchResults.innerHTML = html;
        searchResults.style.display = "block";
    }

    document.addEventListener("click", function (e) {
        if (!searchForm.contains(e.target)) {
            searchResults.style.display = "none";
        }
    });
});
