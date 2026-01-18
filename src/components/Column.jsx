import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card';

/**
 * Column komponent - repræsenterer en status kolonne på boardet
 * Fungerer som drop zone for draggable kort
 */
function Column({ title, cards, onAddCard, onDeleteCard, onEditCard }) {
    // Opretter drop zone - identifiseret af kolonnens status
    const { setNodeRef, isOver } = useDroppable({
        id: title,
    });

    return (
        <section 
            className={`column ${isOver ? 'column-over' : ''}`}
            ref={setNodeRef}
        >
            <header className="column-header">
                <h2>{title}</h2>
                <span className="card-count">{cards.length}</span>
            </header>

            {/* Liste af kort i denne kolonne */}
            <div className="column-cards">
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        onDelete={onDeleteCard}
                        onEdit={onEditCard}
                    />
                ))}
            </div>

            {/* Knap til at tilføje nyt kort */}
            <button 
                onClick={() => onAddCard(title)}
                className="column-add-btn"
                aria-label={`Tilføj kort til ${title}`}
            >
                + Tilføj kort
            </button>
        </section>
    );
}

export default Column;
