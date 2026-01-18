import React from 'react';
import Board from './components/Board';

/**
 * App komponent - root komponent for applikationen
 * Simple wrapper der blot renderer Board komponenten
 */
function App() {
    return (
        <div className="app">
            <Board />
        </div>
    );
}

export default App;
