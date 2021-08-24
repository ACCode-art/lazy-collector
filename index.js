// file imports

import { enemyNames, ultraRareEnemies } from './enemies.js';
import {
  globalRareEncounterChance,
  globalCatchChance,
  passiveCatches,
  passiveRolls,
  passiveRate,
} from './globalVariables.js';

const numberOfEnemies = 36;

const menu = document.querySelector('.menu');
const menu__overlay = document.querySelector('.menu__overlay');
const main = document.querySelector('.main');
const enemyImage__dom = document.querySelector('.enemyImage__dom');
const enemyStats__dom = document.querySelector('.enemyStats__dom');
const actionBar = document.querySelector('.actionBar');
const catchBtn__dom = document.querySelector('.catch__btn');
const rollBtn__dom = document.querySelector('.roll__btn');
const passive__time = document.querySelector('.passive__time');
const monster__bagContainer = document.querySelector('.monster__bagContainer');
const monster__bag = document.querySelector('.monster__bag');
const global__leaderboardContainer = document.querySelector(
  '.global__leaderboardContainer'
);
const player__information = document.querySelector('.player__information');
const player__informationContainer = document.querySelector(
  '.player__informationContainer'
);
const player__informationCollection = document.querySelector(
  '.player__informationCollection'
);
const global__leaderboard = document.querySelector('.global__leaderboard');
const back__home = document.querySelector('.back__home');
const playerLevel__dom = document.querySelector('.playerLevel__dom');
const message__dom = document.querySelector('.message__dom');
const change__username = document.querySelector('.change__username');
const change__usernameInputDom = document.querySelector(
  '.change__usernameInput'
);
const change__usernameButtonDom = document.querySelector(
  '.change__usernameButton'
);

const soulStones__dom = document.querySelector('.soulStones__dom');
const progress__bar = document.querySelector('.progress__bar');

const message = (msg, bool) => {
  message__dom.textContent = msg;

  bool
    ? (message__dom.style.color = 'green')
    : (message__dom.style.color = 'red');
};

actionBar.addEventListener('click', (e) => {
  const target = e.target.className;
  switch (true) {
    case target === 'catch__btn btn':
      attemptToCatch();
      break;
    case target === 'roll__btn btn':
      rollUpdateDom();
      break;
  }
});

main.addEventListener('click', (e) => {
  const target = e.target.className;

  switch (true) {
    case target === 'back__home':
      removeAllOverlays();
      break;
  }
});

const removeAllOverlays = () => {
  monster__bag.classList.remove('display-flex');
  global__leaderboard.classList.remove('display-flex');
  menu__overlay.classList.remove('display-flex');
  player__information.classList.remove('display-flex');
};

const removeMenuOverlay = () => {
  menu__overlay.classList.remove('display-flex');
};

menu.addEventListener('click', () => {
  menu__overlay.classList.toggle('display-flex');
});

menu__overlay.addEventListener('click', (e) => {
  let currentSaveState = getSave();
  const target = e.target.textContent;

  switch (true) {
    case target === 'Monster Bag':
      getMonsters();
      removeMenuOverlay();
      break;
    case target === 'Global Leaderboard':
      removeMenuOverlay();
      break;
    case target === 'Close':
      removeAllOverlays();
      break;
    case target === 'Roll Rare Encounter':
      if (currentSaveState.soul_stones >= 10) {
        createUltraRareEncounter();
      }
      removeAllOverlays();
      break;
    case target === 'Player Stats':
      getPlayerStats();

      break;
  }
});

monster__bag.addEventListener('click', (e) => {
  const target = e.target;

  if (target.textContent === 'Delete') {
    let currentSaveState = getSave();
    const closestItem = target.closest('.list__pageItem');
    const item = Number(closestItem.querySelector('.item-id').textContent);

    let currentSaveStateMonsters = currentSaveState.monsters;

    for (let i = 0; i < currentSaveStateMonsters.length; i++) {
      const element = currentSaveStateMonsters[i];

      if (element.id === item) {
        currentSaveStateMonsters.splice(i, 1);
        currentSaveState.soul_stones += 1;
        currentSaveState.catches += 1;
      }
    }

    save(currentSaveState);
    updateDom(currentSaveState);
    getMonsters();
  }
});

let levelArrayNumber = 100;

const levelArray = [];

function levelArrayRun() {
  for (let i = 0; i < 10; i++) {
    levelArrayNumber = levelArrayNumber * 1.4;

    levelArray.push(Math.floor(levelArrayNumber));
  }
}

levelArrayRun();

const player = {
  name: 'Player',
  level: 1,
  catches: 30,
  monsters: [],
  experience: 0,
  totalMonstersCaught: 0,
  rolls: 50,
  soul_stones: 5,
  caughtCollection: [],
  caughtCollectionNumber: 0,
};

console.log(levelArray);

const getPlayerStats = () => {
  let currentSaveState = getSave();

  player__informationContainer.innerHTML = '';
  player__informationCollection.innerHTML = '';

  const HTML = `<p>Name: ${currentSaveState.name}</p>
  <p>Catches Left: ${currentSaveState.catches}</p>
  <p>Collection Complete: ${
    currentSaveState.caughtCollectionNumber
  }/${numberOfEnemies}</p>
  <p>Level: ${currentSaveState.level}</p>
  <p>Experience: ${currentSaveState.experience} ➡ ${
    levelArray[currentSaveState.level - 1]
  } (next level)</p>
  <p>Rolls Left: ${currentSaveState.rolls}</p>
  <p>Soul Stones: ${currentSaveState.soul_stones}</p>
  <p>Total Monsters Caught: ${currentSaveState.totalMonstersCaught}</p>`;

  player__informationContainer.innerHTML = HTML;

  let caughtCollectionSorted = currentSaveState.caughtCollection.sort();

  for (let i = 0; i < caughtCollectionSorted.length; i++) {
    const monster = caughtCollectionSorted[i];

    const HTML = `<p>${monster},</p>`;

    player__informationCollection.insertAdjacentHTML('beforeend', HTML);
  }

  player__information.classList.add('display-flex');
};

const addToCaughtCollection = (caughtEnemyName) => {
  let currentSaveState = getSave();

  if (currentSaveState.caughtCollection.length === 0) {
    currentSaveState.caughtCollection.push(caughtEnemyName);
    currentSaveState.caughtCollectionNumber += 1;
  }

  let found = false;

  for (let i = 0; i < currentSaveState.caughtCollection.length; i++) {
    const element = currentSaveState.caughtCollection[i];

    if (element === caughtEnemyName) {
      found = true;
      break;
    }

    if (currentSaveState.caughtCollection.length === i + 1 && !found) {
      currentSaveState.caughtCollection.push(caughtEnemyName);
      currentSaveState.caughtCollectionNumber += 1;
    }
  }

  save(currentSaveState);
};

const checkLevel = () => {
  let currentSaveState = getSave();

  switch (true) {
    case currentSaveState.experience > 0 &&
      currentSaveState.experience < levelArray[0]:
      currentSaveState.level = 1;
      progress__bar.max = levelArray[0];
      break;
    case currentSaveState.experience >= levelArray[0] &&
      currentSaveState.experience < levelArray[1]:
      currentSaveState.level = 2;
      progress__bar.max = levelArray[1];
      break;
    case currentSaveState.experience >= levelArray[1] &&
      currentSaveState.experience < levelArray[2]:
      currentSaveState.level = 3;
      progress__bar.max = levelArray[2];
      break;
    case currentSaveState.experience >= levelArray[2] &&
      currentSaveState.experience < levelArray[3]:
      currentSaveState.level = 4;
      progress__bar.max = levelArray[3];
      break;
    case currentSaveState.experience >= levelArray[3] &&
      currentSaveState.experience < levelArray[4]:
      currentSaveState.level = 5;
      progress__bar.max = levelArray[4];
      break;
    case currentSaveState.experience >= levelArray[4] &&
      currentSaveState.experience < levelArray[5]:
      currentSaveState.level = 6;
      progress__bar.max = levelArray[5];
      break;
    case currentSaveState.experience >= levelArray[5] &&
      currentSaveState.experience < levelArray[6]:
      currentSaveState.level = 7;
      progress__bar.max = levelArray[6];
      break;
    case currentSaveState.experience >= levelArray[6] &&
      currentSaveState.experience < levelArray[7]:
      currentSaveState.level = 8;
      progress__bar.max = levelArray[7];
      break;
    case currentSaveState.experience >= levelArray[7] &&
      currentSaveState.experience < levelArray[8]:
      currentSaveState.level = 9;
      progress__bar.max = levelArray[8];
      break;
    case currentSaveState.experience <= levelArray[9]:
      currentSaveState.level = 10;
      progress__bar.max = levelArray[9];
      break;
  }
  updateDom(currentSaveState);
  save(currentSaveState);
};

const randomEnemyFromPool = (arr) => {
  let randomItem = Math.floor(Math.random() * arr.length);
  return arr[randomItem];
};

const rarityCollection = () => {
  let randomNumber = Math.random().toFixed(4) * 10;

  return randomNumber < globalRareEncounterChance
    ? randomEnemyFromPool(enemyNames[0].monsters)
    : randomEnemyFromPool(enemyNames[1].monsters);
};

const getRandomNumberBetween = (level) => {
  let rn = Math.random() * level;

  if (rn < 1) {
    return rn + 1;
  } else {
    return rn;
  }
};

const getStatNumber = (level, stat) => {
  let percentage = Math.floor(getRandomNumberBetween(level * 10)) / 100;

  let maths = Math.floor(stat * percentage);
  return maths;
};

const RandomRoll = (num) => {
  const roll = Math.random();
  return roll * num;
};

const createUniqueId = () => {
  return Number(Math.floor(RandomRoll(1000)) + Date.now());
};

const createRandomEnemy = () => {
  let currentSaveState = getSave();

  let nameImageStatCeiling = rarityCollection();

  let attack = getStatNumber(
    currentSaveState.level,
    nameImageStatCeiling.baseStats.attack
  );

  let health = getStatNumber(
    currentSaveState.level,
    nameImageStatCeiling.baseStats.health
  );

  return {
    name: nameImageStatCeiling.name,
    img: nameImageStatCeiling.img,
    attack: attack,
    health: health,
    rating: attack + health,
    maxStats:
      nameImageStatCeiling.baseStats.attack +
      nameImageStatCeiling.baseStats.health,

    id: createUniqueId(),
  };
};

const randomUltraRareEnemy = (arr) => {
  const rn = Math.floor(Math.random() * arr.length);
  return arr[rn];
};

const createUltraRareEnemy = () => {
  let currentSaveState = getSave();

  let nameImageStatCeiling = randomUltraRareEnemy(ultraRareEnemies);

  let attack = getStatNumber(
    currentSaveState.level,
    nameImageStatCeiling.baseStats.attack
  );

  let health = getStatNumber(
    currentSaveState.level,
    nameImageStatCeiling.baseStats.health
  );

  currentSaveState.soul_stones -= 10;
  updateDom(currentSaveState);
  save(currentSaveState);

  return {
    name: nameImageStatCeiling.name,
    img: nameImageStatCeiling.img,
    attack: attack,
    health: health,
    rating: attack + health,
    maxStats:
      nameImageStatCeiling.baseStats.attack +
      nameImageStatCeiling.baseStats.health,

    id: createUniqueId(),
  };
};

let currentEnemy;

const createUltraRareEncounter = () => {
  currentEnemy = createUltraRareEnemy();

  enemyImage__dom.src = currentEnemy.img;
  const HTML = `<div class="enemyStat__item">${currentEnemy.name}
  </div><div class="enemyStat__item">Attack: ${currentEnemy.attack}
  </div><div class="enemyStat__item">Health: ${currentEnemy.health}
  </div>`;
  enemyStats__dom.innerHTML = HTML;
};

const createEncounter = () => {
  let currentSaveState = getSave();
  currentEnemy = createRandomEnemy();
  let alreadyCaught = false;

  for (let i = 0; i < currentSaveState.caughtCollection.length; i++) {
    const collectionEnemy = currentSaveState.caughtCollection[i];

    if (currentEnemy.name === collectionEnemy) {
      alreadyCaught = true;
    }
  }
  //

  enemyImage__dom.src = currentEnemy.img;
  const HTML = `<div class="enemyStat__item">${currentEnemy.name}
  </div><div class="enemyStat__item">Attack: ${currentEnemy.attack}
  </div><div class="enemyStat__item">Health: ${currentEnemy.health}
  <div class="enemyStat__item need">${alreadyCaught ? 'Already caught' : 'Need'}
  </div>
  </div>`;
  enemyStats__dom.innerHTML = HTML;
};

const isItCaught = () => {
  const roll = RandomRoll(100);
  return roll <= globalCatchChance;
};

const attemptToCatch = () => {
  let currentSaveState = getSave();

  if (currentSaveState.catches > 0) {
    if (currentEnemy === null || currentEnemy === undefined) {
      message('You need to roll, no current enemy', false);
    } else {
      const attempt = isItCaught();

      if (attempt) {
        addToCaughtCollection(currentEnemy.name);
        saveSucessfulCatch(currentEnemy);
        message(`You have caught ${currentEnemy.name}`, true);
        createEncounter();
      } else {
        message(`You failed to catch ${currentEnemy.name}`, false);
        saveFailedCatch();
      }

      checkLevel();
    }
  } else {
    message('not enough catches', false);
  }
};

const save = (state) => {
  localStorage.setItem('lazy_collector', JSON.stringify(state));
};

const getSave = () => {
  const saveState = localStorage.getItem('lazy_collector');
  return JSON.parse(saveState);
};

const updateDom = (saveState) => {
  catchBtn__dom.textContent = `Catch (${saveState.catches} left)`;
  rollBtn__dom.textContent = `Roll (${saveState.rolls} left)`;
  soulStones__dom.textContent = `Soul Stones: ${saveState.soul_stones}`;
  playerLevel__dom.textContent = `Level ${saveState.level}`;
  progress__bar.value = saveState.experience;
};

const minusOneRoll = () => {
  let currentSaveState = getSave();
  currentSaveState.rolls -= 1;
  save(currentSaveState);
};

const rollUpdateDom = () => {
  let currentSaveState = getSave();
  if (currentSaveState.rolls > 0) {
    createEncounter();
    currentSaveState.rolls -= 1;
    updateDom(currentSaveState);
  } else {
    message(`You don't have enough rolls`);
  }

  save(currentSaveState);
};

const saveSucessfulCatch = (caughtMonster) => {
  let currentSaveState = getSave();
  currentSaveState.catches -= 1;
  currentSaveState.totalMonstersCaught += 1;
  currentSaveState.experience += 4;
  currentSaveState.monsters.push(caughtMonster);
  updateDom(currentSaveState);
  save(currentSaveState);
};

const saveFailedCatch = () => {
  let currentSaveState = getSave();
  currentSaveState.catches -= 1;
  updateDom(currentSaveState);
  save(currentSaveState);
};

const getCurrentTime = () => {
  let currentDate = new Date();
  let time = currentDate.getHours();
  return time;
};

const getMonsters = () => {
  let currentSaveState = getSave();

  monster__bagContainer.innerHTML = '';

  let allMonsters = currentSaveState.monsters.sort(
    (a, b) => b.rating - a.rating
  );

  for (let i = 0; i < allMonsters.length; i++) {
    const monster = allMonsters[i];

    const HTML = `<div class="list__pageItem">
    <img class="list__pageImg" src=${monster.img}></img>
    <div class="item" >${monster.name}</div>
    <div class="item">${monster.attack}</div>
    <div class="item">${monster.health}</div>
    <div class="item">${monster.rating}/${monster.maxStats}</div>
    <div class="item item-delete">Delete</div>
    <div class="item-id">${monster.id}</div>
    </div>`;

    monster__bagContainer.insertAdjacentHTML('beforeend', HTML);
  }

  monster__bag.classList.add('display-flex');
};

const gameSetup = () => {
  if (!localStorage.getItem('lazy_collector')) {
    save(player);
    updateDom(player);
    createEncounter();
  } else {
    let currentSaveState = getSave();
    if (currentSaveState.rolls > 0) {
      currentSaveState.rolls -= 1;
      createEncounter();
    }

    checkLevel();
    updateDom(currentSaveState);
    save(currentSaveState);
  }
};

const checkDarkMode = () => {
  const darkmode = getCurrentTime();

  if (darkmode >= 6 && darkmode < 19) {
    main.classList.remove('bg-night');
    main.classList.add('bg-day');
  } else {
    main.classList.remove('bg-day');
    main.classList.add('bg-night');
  }
};

const passiveRollsAndCatches = () => {
  let currentSaveState = getSave();
  currentSaveState.catches += passiveCatches;
  currentSaveState.rolls += passiveRolls;
  updateDom(currentSaveState);
  save(currentSaveState);
};

let remainingTime = passiveRate / 1000;

const timeLeft = () => {
  remainingTime -= 1;

  let d = Number(remainingTime);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h > 0 ? h + (h == 1 ? ' h ' : ' h ') : '';
  let mDisplay = m > 0 ? m + (m == 1 ? 'm ' : 'm ') : '';
  let sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : '';

  passive__time.textContent = hDisplay + mDisplay + sDisplay;
  enemyImage__dom.alt = `You need some rolls...Next refresh in ${
    hDisplay + mDisplay + sDisplay
  }`;
  document.title = `Lazy Collector ${hDisplay + mDisplay + sDisplay}`;
  if (remainingTime <= 0) {
    passiveRollsAndCatches();
    remainingTime = passiveRate / 1000;
  }
};

gameSetup();
checkDarkMode();
setInterval(checkDarkMode, 60000);
setInterval(timeLeft, 1000);
