import '../style/Clavier.css'

const keyboardRows = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n'],
]

function Clavier({ onKeyDown, keyStatuses, disabled }) {
  function handleKeyClick(key) {
    onKeyDown({
      key,
      preventDefault() {},
    })
  }

  return (
    <section
      className="clavier"
      aria-label="Clavier virtuel"
      aria-disabled={disabled}
    >
      {keyboardRows.map((row, rowIndex) => (
        <div className="clavier-ligne" key={rowIndex}>
          {row.map((letter) => {
            const status = keyStatuses[letter] ?? ''

            return (
              <button
                className={`clavier-touche clavier-touche--${status}`}
                key={letter}
                type="button"
                disabled={disabled}
                aria-label={`Lettre ${letter.toUpperCase()}`}
                onClick={() => handleKeyClick(letter)}
              >
                {letter.toUpperCase()}
              </button>
            )
          })}
        </div>
      ))}

      <div className="clavier-ligne clavier-ligne--actions">
        <button
          className="clavier-touche clavier-touche--action"
          type="button"
          disabled={disabled}
          onClick={() => handleKeyClick('Backspace')}
        >
          Retour arrière
        </button>

        <button
          className="clavier-touche clavier-touche--action"
          type="button"
          disabled={disabled}
          onClick={() => handleKeyClick('Enter')}
        >
          Entrée
        </button>
      </div>
    </section>
  )
}

export default Clavier