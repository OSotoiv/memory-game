const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray, num) {
  possiblePairs = num / 2;
  num /= 10;
  let size = 'large';
  if (num === 2) {
    size = 'small';
  }
  for (let i = 0; i < num; i++) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");
      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);
      newDiv.classList.add(size);
      newDiv.setAttribute("data-clickable", "true");
      newDiv.setAttribute("data-color", color);
      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);
      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }
}

// TODO: Implement this function!
let cardCount = 0;
let pairArray = [];
let tries = 0;
let possiblePairs = 0;
//span tracking number of tries to make a pair
const attempts = document.querySelector('#attempts');
//button that starts the game. 
const startGame = document.querySelector('#start');
//input for number of cards.
const numCards = document.querySelector('#numCards');

startGame.addEventListener('submit', function (e) {
  e.preventDefault();
  // console.dir(e.target)
  e.target[0].disabled = true;
  e.target[1].disabled = true;
  createDivsForColors(shuffledColors, parseInt(numCards.value));
})
//turn the card up, reveal color, send to array to hold
function flipUp(card) {
  //disables flipping the same card twice
  card.setAttribute('data-clickable', "false");
  //reveals the color
  card.style.backgroundColor = card.getAttribute('data-color');
  //rotates the card
  card.classList.toggle('flip');
  //if this is the second card, check if they match;
  if (cardCount === 1) {
    checkMatch();
  } else {
    cardCount++;
  }
};
//check two cards for a match
function checkMatch() {
  tries++;
  //compair two cards based on values in the class list
  if (pairArray[0].className === pairArray[1].className) {
    possiblePairs--;
    clearMatch();
  } else {
    setTimeout(flipDown, 1000, pairArray);
  }
  attempts.innerText = tries;
}
//flip cards down if not a match
function flipDown(pairArray) {
  for (let card of pairArray) {
    card.style.backgroundColor = "white";
    card.classList.toggle('flip');
    card.setAttribute('data-clickable', 'true');
  }
  clearMatch();
}
//clear array of cards being compared
function clearMatch() {
  cardCount = 0;
  //does this leak memory because im not using the same array?
  pairArray = [];
  if (possiblePairs === 0) {
    gameOver();
  }
}
//listen for click on cards
function handleCardClick(event) {
  const card = event.target;
  const clickable = card.getAttribute('data-clickable')
  if (pairArray.length < 2 && clickable === "true") {
    pairArray[cardCount] = card;
    flipUp(card);
  }
}
function gameOver() {
  if (parseInt(numCards.value) === 10) {
    const highScore10 = localStorage.getItem('highScore10');
    if (!highScore10 || tries < highScore10) {
      localStorage.setItem('highScore10', tries);
      const score10 = document.querySelector('#score10');
      score10.innerText = tries;
    }
  } else {
    const highScore20 = JSON.parse(localStorage.getItem('highScore20'));
    if (!highScore20 || tries < highScore20) {
      localStorage.setItem('highScore20', tries);
      const score20 = document.querySelector('#score20');
      score20.innerText = tries;
    }
  }

}
window.addEventListener('DOMContentLoaded', function (event) {
  const score10 = document.querySelector('#score10');
  score10.innerText = this.localStorage.getItem("highScore10");
  const score20 = document.querySelector('#score20');
  score20.innerText = this.localStorage.getItem("highScore20");
})

//What I would do if I had more time. I would get the timer to work. using set interval was the only way I
//could come up with to make a time. 
//Next I would add a way of indicating if the player hit the new high score and ask to update their name. 
//Lastly I thought to make this a "Memories Game", where the player can add photos and share the game with others. 
//people might use it as an invitation, or a way to send a digital birthday/mothers day card. 