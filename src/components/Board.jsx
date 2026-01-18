import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Column from './Column';
import CardForm from './CardForm';
import { saveToStorage, loadFromStorage } from '../utils/storage';

/**
 * Board komponent - hovedkomponent der indeholder hele board logik
 * Styre state, localStorage persistens, og drag-and-drop funktionalitet
 */
function Board() {
    // Alle kort gemmes i en enkelt state - forenkler management
    const [cards, setCards] = useState([]);
    
    // Formular til at tilføje/redigere kort
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [newCardStatus, setNewCardStatus] = useState('Todo');

    // Konfigurerer pointer sensor til mouse/touch input
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Kræver 8px drag før aktivering - undgår utilsigtet klik
            },
        })
    );

    // Kolonner - bruges til at gruppere kort
    const columns = ['Todo', 'In Progress', 'Done'];

    // Indlæs gemte data ved initial render - hvis ingen data, opret sample kort
    useEffect(() => {
        const savedCards = loadFromStorage();
        if (savedCards) {
            setCards(savedCards);
        } else {
            // Opret 3 fiktive sample kort til demonstration
            const sampleCards = [
                {
                    id: '1',
                    title: 'Opdater projekt dokumentation',
                    description: 'Gennemgå og opdatere README.md med nyeste ændringer',
                    assignee: 'Anders Jensen',
                    status: 'Todo',
                    dueDate: '2026-01-25'
                },
                {
                    id: '2',
                    title: 'Implementer auth system',
                    description: 'Tilføj login og logout funktionalitet med JWT tokens',
                    assignee: 'Maria Nielsen',
                    status: 'In Progress',
                    dueDate: '2026-01-20'
                },
                {
                    id: '3',
                    title: 'Deploy til production',
                    description: 'Setup CI/CD pipeline og deploy til staging',
                    assignee: 'Peter Hansen',
                    status: 'Done',
                    dueDate: '2026-01-15'
                }
            ];
            setCards(sampleCards);
        }
    }, []);

    // Automatisk gem til localStorage når cards ændres
    useEffect(() => {
        if (cards.length > 0 || localStorage.getItem('project-board-data')) {
            saveToStorage(cards);
        }
    }, [cards]);

    // Filtrer kort for hver kolonne baseret på status
    const getColumnCards = (status) => {
        return cards.filter(card => card.status === status);
    };

    // Genererer unikt ID til nye kort
    const generateId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    // Åben formular til at oprette nyt kort
    const handleAddCard = (status) => {
        setEditingCard(null);
        setNewCardStatus(status);
        setShowForm(true);
    };

    // Åben formular til at redigere eksisterende kort
    const handleEditCard = (card) => {
        setEditingCard(card);
        setNewCardStatus(card.status);
        setShowForm(true);
    };

    // Gem nyt kort eller opdater eksisterende
    const handleSaveCard = (cardData) => {
        if (editingCard) {
            // Opdater eksisterende kort
            setCards(cards.map(card => 
                card.id === editingCard.id 
                    ? { ...card, ...cardData }
                    : card
            ));
        } else {
            // Opret nyt kort
            const newCard = {
                id: generateId(),
                status: newCardStatus,
                ...cardData
            };
            setCards([...cards, newCard]);
        }
        setShowForm(false);
    };

    // Annuller formular - luk modal/form
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCard(null);
    };

    // Slet kort fra boardet
    const handleDeleteCard = (cardId) => {
        if (window.confirm('Er du sikker på at du vil slette dette kort?')) {
            setCards(cards.filter(card => card.id !== cardId));
        }
    };

    // Håndter drop event - opdater kortets status når det flyttes
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        // Kontroller at kortet blev droppet på en gyldig kolonne
        if (!over || !columns.includes(over.id)) {
            return;
        }

        const cardId = active.id;
        const newStatus = over.id;

        // Find kortet og tjek om det allerede har denne status
        const card = cards.find(c => c.id === cardId);
        if (card && card.status !== newStatus) {
            // Opdater status på det flyttede kort
            setCards(cards.map(c => 
                c.id === cardId 
                    ? { ...c, status: newStatus }
                    : c
            ));
        }
    };

    return (
        <main className="board">
            <header className="board-header">
                <h1>Project Board</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="board-toggle-btn"
                >
                    {showForm ? 'Luk formular' : 'Nyt kort'}
                </button>
            </header>

            {/* Formular til oprettelse/redigering */}
            {showForm && (
                <div className="form-container">
                    <CardForm 
                        editingCard={editingCard}
                        onSave={handleSaveCard}
                        onCancel={handleCancelForm}
                    />
                </div>
            )}

            {/* Board med kolonner - DndContext wrapper muliggør drag-and-drop */}
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="board-columns">
                    {columns.map(column => (
                        <Column
                            key={column}
                            title={column}
                            cards={getColumnCards(column)}
                            onAddCard={handleAddCard}
                            onDeleteCard={handleDeleteCard}
                            onEditCard={handleEditCard}
                        />
                    ))}
                </div>
            </DndContext>
        </main>
    );
}

export default Board;
