async function loadLeaderboard() {
    try {
        // Solicitar puntajes desde `scores.php`
        const response = await fetch("scores.php?game=TicTacToe&orderAsc=1");
        if (!response.ok) {
            throw new Error("Error al cargar la tabla de líderes.");
        }

        const scores = await response.json();

        const bestTimesList = document.getElementById("best-times");
        bestTimesList.innerHTML = "";

        // Mostrar puntajes en la lista
        scores.forEach((score) => {
            const li = document.createElement("li");
            li.textContent = `${score.player} - ${score.score} ms - ${score.date}`;
            bestTimesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar los puntajes:", error);
    }
}

// Cargar la tabla de líderes al cargar la página
document.addEventListener("DOMContentLoaded", loadLeaderboard);
