import { useEffect, useState, useRef } from 'react'
import './App.css'
import Modal from './components/Modal'
import Line from './components/Line'

const API_URL = '/words.js';
const WORD_LENGTH = 5;

export default function App() {

  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fetchedRef = useRef(false)

  useEffect(() => {
    const fetchWord = async () => {
      // Only fetch once
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      
      const response = await fetch(API_URL)
      const words = await response.json()
      const randomWord = words[Math.floor(Math.random() * words.length)]
      console.log('Solution word:', randomWord)
      setSolution(randomWord)
    }
    fetchWord()
  }, [])


  useEffect(() => {
    const handleKeydown = (event) => {
      if (isGameOver) return
      if (event.key === 'Enter') {
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
          setIsGameOver(true)
        }
      }

      if(event.key === 'Backspace') {
        setCurrentGuess(currentGuess => currentGuess.slice(0, -1))
        return
      }

      if (currentGuess.length >= WORD_LENGTH) return;
      
      const isLetter = event.key.match(/^[a-z]{1}$/) != null;
      if (isLetter) {
        //If the currentInput is "appl" and the player types "e", it becomes "apple"
        // This ensures that we're always working with the most up-to-date value of the current guess when adding a new character.
        setCurrentGuess(currentInput => currentInput + event.key)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [currentGuess, isGameOver, solution, guesses])

  return (
    <div className="container">
      <Modal />
      {
        guesses.map((guess, index) => {
          //if index matches findIndex (index of first null value), then isCurrentGuess is true
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
        })
      }
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  )
}