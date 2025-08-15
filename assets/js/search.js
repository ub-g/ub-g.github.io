document.addEventListener("DOMContentLoaded", function () {
    let games = [];
    let isDataLoaded = false;

    const searchInput = document.getElementById("gameSearch");
    const gameList = document.getElementById("gameList");

    // Load games from local file
    fetch("/assets/js/games.js")
        .then(response => {
            if (!response.ok) throw new Error("Error loading games");
            return response.json();
        })
        .then(data => {
            games = data;
            isDataLoaded = true;
        })
        .catch(error => {
            console.error("Game load error:", error);
            gameList.innerHTML = "<p style='color:red;'>Error loading games</p>";
        });

    // Search as user types
    searchInput.addEventListener("input", function () {
        const input = this.value.trim().toLowerCase();
        gameList.innerHTML = "";

        if (!input) {
            gameList.style.display = "none";
            return;
        }

        if (!isDataLoaded) {
            gameList.innerHTML = "<p>Loading games...</p>";
            gameList.style.display = "block";
            return;
        }

        // Search anywhere in the name
        const results = games.filter(game =>
            game.name.toLowerCase().includes(input)
        );

        if (results.length > 0) {
            results.forEach(game => {
                const item = document.createElement("div");
                item.className = "game-item";
                item.innerHTML = `<a href="${game.url}">${game.name}</a>`;
                gameList.appendChild(item);
            });
        } else {
            gameList.innerHTML = "<p>No results found</p>";
        }

        gameList.style.display = "block";
    });

    // Hide results when clicking outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest("#gameSearch, #gameList")) {
            gameList.style.display = "none";
        }
    });
});
