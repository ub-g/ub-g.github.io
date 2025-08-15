document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("gameSearch");
    const resultsList = document.getElementById("gameList");

    function searchGames() {
        const query = searchInput.value.trim().toLowerCase();
        resultsList.innerHTML = "";

        if (!query) {
            resultsList.classList.add("hidden");
            return;
        }

        const filteredGames = games.filter(game =>
            game.name.toLowerCase().includes(query)
        );

        if (filteredGames.length === 0) {
            resultsList.innerHTML = `<p class="p-3 text-gray-400">No results found</p>`;
            resultsList.classList.remove("hidden");
            return;
        }

        filteredGames.forEach(game => {
            const gameItem = document.createElement("a");
            gameItem.href = `https://ub-g.github.io/${game.url}`;
            gameItem.textContent = game.name;
            gameItem.className = "block px-4 py-2 hover:bg-gray-700 rounded";
            resultsList.appendChild(gameItem);
        });

        resultsList.classList.remove("hidden");
    }

    searchInput.addEventListener("input", searchGames);

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) {
            resultsList.classList.add("hidden");
        }
    });
});
