document.addEventListener("DOMContentLoaded", function () {
    let games = [];
    let isDataLoaded = false;

    // Load local games.js file
    fetch("/assets/js/games.js")
        .then(response => {
            if (!response.ok) throw new Error("Network error");
            return response.json();
        })
        .then(data => {
            games = data;
            isDataLoaded = true;
        })
        .catch(error => {
            console.error("Fetch error:", error);
            document.getElementById("gameList").innerHTML = "<p>Error loading games</p>";
        });

    document.getElementById("gameSearch").addEventListener("input", function () {
        const input = this.value.trim().toLowerCase();
        const gameList = document.getElementById("gameList");
        
        gameList.innerHTML = "";
        gameList.style.display = "block";

        if (!input) {
            gameList.style.display = "none";
            return;
        }

        if (!isDataLoaded) {
            gameList.innerHTML = "<p>Loading games...</p>";
            return;
        }

        const results = games.filter(game => 
            game.name.toLowerCase().startsWith(input)
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
    });

    document.addEventListener("click", function (e) {
        if (!e.target.closest("#gameSearch, #gameList")) {
            document.getElementById("gameList").style.display = "none";
        }
    });
});
