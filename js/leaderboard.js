document.addEventListener('DOMContentLoaded', () => {
    updateLeaderboardColors();
});

function updateLeaderboardColors() {
    const leaderboardItems = document.querySelectorAll('#best-times li');

    leaderboardItems.forEach((item, index) => {
        item.classList.remove('gold', 'silver', 'bronze');

        if (index === 0) {
            item.classList.add('gold');  
        } else if (index === 1) {
            item.classList.add('silver');  
        } else if (index === 2) {
            item.classList.add('bronze');  
        }
    });
}
