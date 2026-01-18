// localStorage helper - håndterer persistens af board data
// Abstraherer localStorage logik for at gøre kode vedligeholdelsesvenlig

const STORAGE_KEY = 'project-board-data';

/**
 * Gemmer board data i localStorage
 * @param {Array} cards - Liste af alle kort der skal gemmes
 */
export function saveToStorage(cards) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
        console.error('Kunne ikke gemme til localStorage:', error);
    }
}

/**
 * Henter board data fra localStorage
 * @returns {Array|null} - Gemte kort eller null hvis ingen data findes
 */
export function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Kunne ikke hente fra localStorage:', error);
        return null;
    }
}

/**
 * Rydder alle gemte data - nyttigt til debugging/reset
 */
export function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}
