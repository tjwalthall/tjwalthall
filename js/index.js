document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('matrixGrid');

    if (!grid) return;

    const buttons = Array.from(document.querySelectorAll('.controls .btn'));
    const searchInput = document.getElementById('projectSearch');
    const cards = Array.from(grid.querySelectorAll('.project-card'));

    let currentFilter = 'all';
    let currentSearch = '';
    let currentOrder = shuffleArray([...cards]);

    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'NO PROJECTS FOUND';
    emptyState.hidden = true;
    grid.after(emptyState);

    cards.forEach(card => {
        const image = card.querySelector('img');
        const searchableText = [
            card.dataset.category,
            card.getAttribute('href'),
            image ? image.alt : '',
            card.textContent
        ].join(' ').toLowerCase();

        card.dataset.search = searchableText;
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    function renderMatrix({ shuffle = false } = {}) {
        if (shuffle) {
            currentOrder = shuffleArray([...currentOrder]);
        }

        currentOrder.forEach(card => grid.appendChild(card));

        let visibleCount = 0;

        currentOrder.forEach(card => {
            const matchesFilter =
                currentFilter === 'all' ||
                card.dataset.category === currentFilter;

            const matchesSearch =
                currentSearch === '' ||
                card.dataset.search.includes(currentSearch);

            const isVisible = matchesFilter && matchesSearch;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;

                const idSpan = card.querySelector('.dynamic-id');
                if (idSpan) {
                    idSpan.textContent = `ID: ${String(visibleCount).padStart(2, '0')}`;
                }
            }
        });

        emptyState.hidden = visibleCount > 0;
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentFilter = button.dataset.filter || 'all';

            renderMatrix({ shuffle: button.id === 'shuffleBtn' });
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentSearch = searchInput.value.trim().toLowerCase();
            renderMatrix();
        });

        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                searchInput.value = '';
                currentSearch = '';
                renderMatrix();
            }
        });
    }

    renderMatrix();
});
