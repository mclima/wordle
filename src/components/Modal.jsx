import { useState } from 'react';
import '../styles/Modal.css';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        
        <h2>How To Play</h2>
        <p>Challenge yourself to find the hidden word in 6 attempts!</p>
        
        <ul>
          <li>Type any valid 5-letter word to begin.</li>
          <li>Tile colors reveal clues about the target word.</li>
        </ul>
        
        <div className="examples">
          <h3>Examples</h3>
          
          <div className="example">
            <div className="example-row">
              <div className="example-tile correct">E</div>
              <div className="example-tile">V</div>
              <div className="example-tile">E</div>
              <div className="example-tile">N</div>
              <div className="example-tile">T</div>
            </div>
            <p><strong>E</strong> is in the correct position! Perfect match.</p>
          </div>
          
          <div className="example">
            <div className="example-row">
              <div className="example-tile">P</div>
              <div className="example-tile present">R</div>
              <div className="example-tile">I</div>
              <div className="example-tile">D</div>
              <div className="example-tile">E</div>
            </div>
            <p><strong>R</strong> is in the word but needs to be moved elsewhere.</p>
          </div>
          
          <div className="example">
            <div className="example-row">
              <div className="example-tile">F</div>
              <div className="example-tile">E</div>
              <div className="example-tile">A</div>
              <div className="example-tile absent">S</div>
              <div className="example-tile">T</div>
            </div>
            <p><strong>S</strong> is not in the target word at all.</p>
          </div>
        </div>
        
        <hr />
        
        <p>This game is inspired by <a href="https://www.nytimes.com/games/wordle/index.html">NYT Wordle</a></p>
      </div>
    </div>
  ) : null;
}
