import React from 'react';
import { useDraggable } from '@dnd-kit/core';

/**
 * Card komponent - viser et enkelt kort og gør det draggable
 * Anvender useDraggable hook fra @dnd-kit for at aktivere drag funktionalitet
 */
function Card({ card, onDelete, onEdit }) {
    // Initialiserer draggable - id bruges til at identificere kortet under drag
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: card.id,
    });

    // Transformer position når kortet trækkes - giver visuel feedback
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <article
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="card"
        >
            {/* Kortets indhold */}
            <div className="card-header">
                <h3>{card.title}</h3>
                <button
                    onClick={() => onEdit(card)}
                    className="card-btn"
                    aria-label={`Rediger ${card.title}`}
                >
                    ✏️
                </button>
            </div>
            
            {card.description && (
                <p className="card-description">{card.description}</p>
            )}
            
            <div className="card-meta">
                {card.assignee && (
                    <span className="card-assignee">👤 {card.assignee}</span>
                )}
                {card.dueDate && (
                    <span className="card-date">📅 {card.dueDate}</span>
                )}
            </div>
            
            <button
                onClick={() => onDelete(card.id)}
                className="card-delete-btn"
                aria-label={`Slet ${card.title}`}
            >
                🗑️
            </button>
        </article>
    );
}

export default Card;
