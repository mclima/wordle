import { useEffect, useState, useRef } from 'react'
import './App.css'
import Modal from './components/Modal'
import Line from './components/Line'

const API_URL = import.meta.env.BASE_URL + 'words.js';
const WORD_LENGTH = 5;

export default function App() {

  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fetchedRef = useRef(false)
  const inputRef = useRef(null)
  const [modalNonce, setModalNonce] = useState(0)

  const initGame = async () => {
    setIsGameOver(false)
    setGuesses(Array(6).fill(null))
    setCurrentGuess('')
    setErrorMessage('')
    if (inputRef.current) inputRef.current.focus()

    const response = await fetch(API_URL)
    const words = await response.json()
    const randomWord = words[Math.floor(Math.random() * words.length)]
    console.log('Solution word:', randomWord)
    setSolution(randomWord)
    if (inputRef.current) inputRef.current.focus()
  }

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    initGame()
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])


  const submitGuess = () => {
    if (isGameOver) return
    if (currentGuess.length !== WORD_LENGTH) {
      return
    }
    const allSameLetter = currentGuess.split('').every(char => char === currentGuess[0]);
    if (allSameLetter) {
      setErrorMessage("You can't use the same letter for all tiles!");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    setErrorMessage('');
    const newGuesses = [...guesses]
    const currentIndex = guesses.findIndex(val => val === null)
    newGuesses[currentIndex] = currentGuess
    setGuesses(newGuesses)
    setCurrentGuess('')
    const isCorrect = solution === currentGuess
    if (isCorrect) {
      console.log('Correct! Solution is', solution)
      setIsGameOver(true)
    }
  }

  const handleChange = (e) => {
    if (isGameOver) return
    const value = e.target.value.toLowerCase()
    const lettersOnly = value.replace(/[^a-z]/g, '')
    setCurrentGuess(lettersOnly.slice(0, WORD_LENGTH))
  }

  const handleKeyDown = (e) => {
    if (isGameOver) return
    if (e.key === 'Enter') {
      e.preventDefault()
      submitGuess()
    }
    if (e.key === 'Backspace') {
      return
    }
  }

  const handleVirtualKey = (key) => {
    if (isGameOver) return
    if (key === 'Enter') {
      submitGuess()
      return
    }
    if (key === 'Backspace') {
      setCurrentGuess((g) => g.slice(0, -1))
      return
    }
    if (/^[a-z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((g) => (g + key).slice(0, WORD_LENGTH))
    }
  }

  return (
    <div className="container">
      <Modal key={modalNonce} onClose={() => {
        const el = inputRef.current || document.getElementById('guess-input')
        if (el) el.focus({ preventScroll: true })
        requestAnimationFrame(() => {
          const el2 = inputRef.current || document.getElementById('guess-input')
          if (el2) el2.focus({ preventScroll: true })
        })
        setTimeout(() => {
          const el3 = inputRef.current || document.getElementById('guess-input')
          if (el3) el3.focus({ preventScroll: true })
        }, 50)
      }} />
      <div style={{ margin: '8px 0' }}>
        <button
          type="button"
          onClick={() => setModalNonce((n) => n + 1)}
          style={{
            marginRight: 8,
            padding: '6px 10px',
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: 4,
            fontWeight: 600
          }}
        >
          How to Play
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); if (inputRef.current) inputRef.current.focus({ preventScroll: true }) }}
          onPointerDown={() => { if (inputRef.current) inputRef.current.focus() }}
          onTouchStart={() => { if (inputRef.current) inputRef.current.focus() }}
          onClick={(e) => {
            e.currentTarget.blur()
            // Mobile browsers show the soft keyboard only if focus() happens during the tap.
            // Focus now (inside this click) so the keyboard appears immediately.
            if (inputRef.current) inputRef.current.focus({ preventScroll: true })
            // Kick off reset without awaiting so focus remains
            void initGame()
            // Fallback re-focus next frame
            requestAnimationFrame(() => { if (inputRef.current) inputRef.current.focus({ preventScroll: true }) })
          }}
          style={{
            padding: '6px 10px',
            background: '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: 4,
            fontWeight: 600
          }}
        >
          Reset
        </button>
      </div>
      {guesses.map((guess, index) => {
        const isCurrentGuess = index === guesses.findIndex(val => val === null)
        return (
          <Line 
            key={index}
            wordLength={WORD_LENGTH}
            guess={isCurrentGuess ? currentGuess : guess ?? ''} 
            isFinalGuess={!isCurrentGuess && guess != null}
            solution={solution}
          />
        )
      })}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          type="text"
          id="guess-input"
          inputMode="latin"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={isGameOver ? 'Correct! 🎉' : 'Type here'}
          value={currentGuess}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={WORD_LENGTH}
          style={{
            padding: '8px 10px',
            background: '#1f1f1f',
            border: '1px solid #555',
            color: '#fff',
            borderRadius: 4,
            width: 160
          }}
          disabled={isGameOver}
        />
        <button
          onClick={submitGuess}
          disabled={isGameOver || currentGuess.length !== WORD_LENGTH}
          style={{
            padding: '8px 12px',
            background: '#D4AF37',
            color: '#121213',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600
          }}
        >
          Enter
        </button>
      </div>
      {!isGameOver && (
        <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
          {['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {i === 2 && (
                <button
                  onClick={() => handleVirtualKey('Enter')}
                  style={{ padding: '10px 12px', background: '#2a2a2a', color: '#fff', border: '1px solid #555', borderRadius: 6, fontWeight: 600 }}
                >
                  Enter
                </button>
              )}
              {row.split('').map((ch) => (
                <button
                  key={ch}
                  onClick={() => handleVirtualKey(ch)}
                  style={{ width: 32, height: 42, background: '#2a2a2a', color: '#fff', border: '1px solid #555', borderRadius: 6, textTransform: 'uppercase' }}
                >
                  {ch}
                </button>
              ))}
              {i === 2 && (
                <button
                  onClick={() => handleVirtualKey('Backspace')}
                  aria-label="Backspace"
                  style={{ padding: '10px 12px', background: '#2a2a2a', color: '#fff', border: '1px solid #555', borderRadius: 6, fontWeight: 600 }}
                >
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}