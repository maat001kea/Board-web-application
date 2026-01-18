import React, { useState, useEffect } from 'react';

/**
 * CardForm komponent - formular til oprettelse og redigering af kort
 * Genbruges til både create og edit - differentieres via editingCard prop
 */
function CardForm({ editingCard, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Hvis vi redigerer et kort, forudfyld formular med eksisterende data
    useEffect(() => {
        if (editingCard) {
            setTitle(editingCard.title);
            setDescription(editingCard.description || '');
            setAssignee(editingCard.assignee || '');
            setDueDate(editingCard.dueDate || '');
        }
    }, [editingCard]);

    // Gem kort - kalder onSave med form data
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Titel er påkrævet
        if (!title.trim()) {
            alert('Titel er påkrævet');
            return;
        }

        onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            assignee: assignee.trim() || undefined,
            dueDate: dueDate || undefined
        });
    };

    // Nulstil formular
    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setAssignee('');
        setDueDate('');
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="card-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titel *"
                className="form-input"
                autoFocus
                required
            />
            
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beskrivelse (valgfri)"
                className="form-textarea"
                rows="3"
            />
            
            <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Tildelt til (valgfri)"
                className="form-input"
            />
            
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
            />
            
            <div className="form-actions">
                <button type="submit" className="form-submit-btn">
                    {editingCard ? 'Gem ændringer' : 'Opret kort'}
                </button>
                <button 
                    type="button" 
                    onClick={handleCancel}
                    className="form-cancel-btn"
                >
                    Annuller
                </button>
            </div>
        </form>
    );
}

export default CardForm;
