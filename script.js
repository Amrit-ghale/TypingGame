// Words arrays
const level1Words = ['cat', 'dog', 'hat', 'car', 'run', 'sun', 'cup', 'red', 'bed', 'top'];
const level2Words = ['bird', 'book', 'tree', 'ball', 'rain', 'road', 'cake', 'fish', 'frog', 'moon'];
const level3Words = ['apple', 'banana', 'beach', 'clock', 'chair', 'heart', 'music', 'pizza', 'smile', 'water'];
const level4Words = ['juice', 'light', 'mouse', 'paint', 'queen', 'shirt', 'tiger', 'zebra', 'cloud', 'grape'];

let currentLevel = 1;
let currentWordIndex = 0;
let score = 0;
let lives = 3;
let wordsArray;

let fallingWordInterval;
let fallingSpeed = 1;

// Set initial game state
function initializeGame() {
  currentWordIndex = 0;
  score = 0;
  lives = 3;
  document.getElementById('score-count').textContent = score;
  document.getElementById('lives-count').textContent = lives;
  document.getElementById('start-button').addEventListener('click', startGame);
}

// Start the game
function startGame() {
  document.getElementById('start-button').removeEventListener('click', startGame);
  document.getElementById('start-button').disabled = true;
  document.getElementById('input-word').disabled = false;
  transitionToLevel(currentLevel);
}

// Transition to the specified level
function transitionToLevel(level) {
  currentLevel = level;
  if (level === 1) {
    wordsArray = level1Words;
    document.getElementById('level-title').textContent = 'Level 1: 3-letter words';
    fallingSpeed = 1;
  } else if (level === 2) {
    wordsArray = level2Words;
    document.getElementById('level-title').textContent = 'Level 2: 4-letter words';
    fallingSpeed = 2;
  } else if (level === 3) {
    wordsArray = level3Words;
    document.getElementById('level-title').textContent = 'Level 3: 5-letter words';
    fallingSpeed = 2.5;
  } else if (level === 4) {
    wordsArray = level4Words;
    document.getElementById('level-title').textContent = 'Level 4: Random words';
    fallingSpeed = 2.6
    ;
  }

  document.getElementById('input-word').value = '';
  document.getElementById('word').textContent = '';
  updateWord();
}

// Transition to the next level
function transitionToNextLevel() {
  if (currentLevel < 4) {
    currentLevel++;
    currentWordIndex = 0;
    transitionToLevel(currentLevel);
  } else {
    // Game completed
    endGame();
  }
}


// Update the current word to type and start falling animation
function updateWord() {
  if (currentWordIndex < wordsArray.length) {
    const word = wordsArray[currentWordIndex];
    document.getElementById('word').textContent = word;

    // Create a new word element
    const wordElement = document.createElement('span');
    wordElement.textContent = word;
    wordElement.classList.add('falling-word');
    wordElement.style.left = Math.floor(Math.random() * 80) + 'vw';

    // Append the word element to the game container
    document.getElementById('game-container').appendChild(wordElement);

    // Start falling animation
    fallingWordInterval = setInterval(() => {
      const currentPosition = parseInt(wordElement.style.top) || 0;
      const newPosition = currentPosition + fallingSpeed;
      wordElement.style.top = newPosition + 'px';

      // Check if the word reaches the bottom
      if (newPosition >= window.innerHeight - 100) {
        clearInterval(fallingWordInterval);
        wordElement.remove();

        // Reduce lives and check game over
        lives--;
        document.getElementById('lives-count').textContent = lives;
        if (lives === 0) {
          endGame();
        }
      }
    }, 10);
  } else {
    // Level completed
    clearInterval(fallingWordInterval);
    currentWordIndex = 0; // Reset the word index for the next level

    // Check if the score reaches 35
    if (score >= 35) {
      // Generate a random level (1, 2, 3, or 4)
      const randomLevel = Math.floor(Math.random() * 4) + 1;
      transitionToLevel(randomLevel);
    } else {
      transitionToNextLevel();
    }
  }
}


// Handle user input
function handleInput(event) {
  if (event.key === 'Enter') {
    const inputWord = document.getElementById('input-word').value.toLowerCase();
    const currentWord = wordsArray[currentWordIndex];
    if (inputWord === currentWord) {
      score++;
      document.getElementById('score-count').textContent = score;

      const wordElements = document.getElementsByClassName('falling-word');
      for (let i = 0; i < wordElements.length; i++) {
        if (wordElements[i].textContent === currentWord) {
          wordElements[i].remove();
          break;
        }
      }
    } else {
      lives--;
      document.getElementById('lives-count').textContent = lives;
      if (lives === 0) {
        endGame();
        return;
      }
    }
    currentWordIndex++;
    document.getElementById('input-word').value = ''; // Clear the input field
    clearInterval(fallingWordInterval); // Stop the falling animation
    updateWord();
  }
}

// End the game
function endGame() {
  clearInterval(fallingWordInterval);
  document.getElementById('word').textContent = 'Game Over';
  document.getElementById('input-word').disabled = true;
}

// Start the game
document.addEventListener('DOMContentLoaded', initializeGame);
document.getElementById('input-word').addEventListener('keyup', handleInput);
