import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function SecretWord({ word, hint, children }) {
  return (
    <span className="secret-word-wrap" tabIndex={0} role="tooltip" aria-label={`${word}: ${hint}`}>
      <span className="secret-word-text">{children || word}</span>
      <span className="secret-word-tooltip card">
        <span className="tooltip-title">✨ Bakery Slang</span>
        <span className="tooltip-body">{hint}</span>
      </span>
    </span>
  );
}
