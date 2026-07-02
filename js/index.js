document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('matrixGrid');

    if (!grid) return;

    const buttons = document.querySelectorAll('.controls .btn');
    let cards = Array.from(grid.querySelectorAll('.project-card'));

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    function renderMatrix(filterType = 'all', triggerShuffle = false) {
        if (triggerShuffle) {
            cards = shuffleArray(cards);
        }

        cards.forEach(card => grid.appendChild(card));

        let sequentialID = 1;

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const idSpan = card.querySelector('.dynamic-id');
            const isVisible = filterType === 'all' || category === filterType;

            card.style.display = isVisible ? 'block' : 'none';

            if (isVisible && idSpan) {
                idSpan.textContent = `ID: ${sequentialID.toString().padStart(2, '0')}`;
                sequentialID++;
            }
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedFilter = button.getAttribute('data-filter');
            const shouldShuffle = button.id === 'shuffleBtn';

            renderMatrix(selectedFilter, shouldShuffle);
        });
    });

    renderMatrix('all', true);
});