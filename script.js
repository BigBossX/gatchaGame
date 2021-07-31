'use strict';

// Select Primary Element
const dice = document.querySelector('.dice');
const players = document.querySelectorAll('.player');

// Select Button Element
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');

// Set Current Score
let currentScore = 0;

let __awplayable = true;

const classDo = (player, doWhat, ...classWhat) => {
  return player.classList[doWhat](...classWhat);
};

const playersDoRoll = (players, random) => {
  players.forEach(player => {
    if (random === 1) {
      classDo(player, 'toggle', 'player--active');
      scoreChanges(0);
      currentScoresChange(player, currentScore);
      return;
    }

    if (classDo(player, 'contains', 'player--active')) {
      scoreChanges(random);
      currentScoresChange(player, currentScore);
    }
  });
};

const diceChanges = random => {
  dice.classList.remove('hidden');
  dice.src = `/images/dice-${random}.png`;
};

const currentScoresChange = (player, currentScore) => {
  const current = player.querySelector('.current');
  const currentScoreDisplay = current.querySelector('.current-score');
  currentScoreDisplay.textContent = currentScore;
};

const scoreChanges = score => {
  if (score === 0) {
    currentScore = score;
    return;
  }
  currentScore += score;
};

btnRoll.addEventListener('click', () => {
  if (__awplayable) {
    const random = Math.trunc(Math.random() * 6) + 1;
    diceChanges(random);
    playersDoRoll(players, random);
  }
});

const playersDoHold = () => {
  players.forEach(player => {
    const totalScore = player.querySelector('.score');
    if (classDo(player, 'contains', 'player--active')) {
      totalScore.textContent = parseInt(totalScore.textContent) + currentScore;
      scoreChanges(0);
    }

    if (parseInt(totalScore.textContent) >= 10) {
      classDo(player, 'remove', 'player--active');
      classDo(player, 'add', 'player--winner');
      __awplayable = false;
      classDo(dice, 'add', 'hidden');
      classDo(btnNew, 'remove', 'hidden');
      return;
    }

    setTimeout(() => {
      if (__awplayable) {
        currentScoresChange(player, 0);
        classDo(player, 'toggle', 'player--active');
      }
    }, 10);
  });
};

btnHold.addEventListener('click', playersDoHold);

const playersDoNew = () => {
  players.forEach(player => {
    const totalScore = player.querySelector('.score');
    classDo(player, 'replace', 'player--winner', 'player--active');
    currentScoresChange(player, 0);
    totalScore.textContent = 0;
  });
};

btnNew.addEventListener('click', () => {
  playersDoNew();
  classDo(btnNew, 'add', 'hidden');
  __awplayable = true;
});
