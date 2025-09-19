export default function Line({ wordLength, guess, isFinalGuess, solution }) {
  const tiles = [];

  for (let i = 0; i < wordLength; i++) {
    const char = guess[i];
    let className = 'tile'
    if(isFinalGuess) {
      if (char === solution[i]) {
        className += '  correct'
      } else if (solution.includes(char)) {
        className += '  present'
      } else {
        className += '  absent'
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    )
  }
  
  return (
    <div className="line">
      {tiles}
    </div>
  )
}