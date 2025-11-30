import './index.css';
import React from "react";
import { createRoot } from 'react-dom/client'; // Import createRoot
import { App } from "./App";

const container = document.getElementById('root');
const root = createRoot(container!); // Create a root.
root.render(<App />); // Initial render