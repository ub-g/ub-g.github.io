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

        const getTitle = $(".list-game .list-title");
        let matchedGames = [];

        for (let i = 0; i < getTitle.length; i++) {
            let title = $(getTitle[i]).text().trim().toLowerCase();
            let gameLink = $(getTitle[i]).parent().attr("href");

            if (query.length === 0 || title.includes(query)) {
                matchedGames.push({
                    link: gameLink,
                    title: $(getTitle[i]).text().trim()
                });
            }
        }
        displayResults(matchedGames);
    }

    function displayResults(games) {
        if (games.length === 0) {
            searchResults.innerHTML = '<p class="no-results text-gray-500 p-2">No games found</p>';
            searchResults.style.display = "block";
            return;
        }
        let html = "";
        games.forEach((game) => {
            html += `<a href="${game.link}" class="search-result-item">
                        <span>${game.title}</span>
                    </a>`;
        });
        searchResults.innerHTML = html;
        searchResults.style.display = "block";
    }

    document.addEventListener("click", function (e) {
        if (!searchForm.contains(e.target)) {
            searchResults.style.display = "none";
        }
    });
});
