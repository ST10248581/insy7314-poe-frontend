import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // optional - remove if you don't have it

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);
root.render(<App />);
