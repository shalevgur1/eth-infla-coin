import { createRoot } from 'react-dom/client';
import React from 'react';
import './styles/main.css';
import App from "./components/App";

// -----------------------------------
// APPLICATION ENTRY POINT
// -----------------------------------

const root = createRoot(document.getElementById('root'));
root.render(<App />);
