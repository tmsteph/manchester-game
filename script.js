const clickSound = document.getElementById('clickSound');
const clueSound = document.getElementById('clueSound');

const scenarios = [
  {
    title: "Missing Microphone Mayhem",
    rooms: [
      { name: "Seaport Ballroom", clue: "A feedback suppressor is missing." },
      { name: "Harbor Ballroom", clue: "You hear ghostly feedback echoes." },
      { name: "CS Desk", clue: "Someone requested a backup mic hours before the event." }
    ],
    suspects: ["Banquet Dave", "Ghost of Hyatt Past", "AV Tech Alex"],
    culprit: "AV Tech Alex"
  },
  {
    title: "Phantom Frequency Frenzy",
    rooms: [
      { name: "Grand Hall", clue: "The mic frequency was hijacked." },
      { name: "Housekeeping", clue: "A walkie-talkie emits static Morse code." },
      { name: "Banquets", clue: "A headset was left in a dessert tray." }
    ],
    suspects: ["The Phantom Tech", "Frequency Steve", "Ghost of Hyatt Past"],
    culprit: "The Phantom Tech"
  }
];

let player = "";
let currentScenario;
let visitedRooms = new Set();
let score = 0;

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

function switchScreen(fromId, toId) {
  document.getElementById(fromId).classList.remove('active');
  document.getElementById(toId).classList.add('active');
}

function updateScoreDisplay() {
  document.getElementById("scoreDisplay").textContent = "Score: " + score;
}

function startGame(character) {
  playSound(clickSound);
  player = character;
  currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  visitedRooms.clear();
  score = 0;
  updateScoreDisplay();

  document.getElementById("greeting").textContent = `Welcome, ${player}!`;
  document.getElementById("scenarioText").textContent = `Mission: ${currentScenario.title}`;

  const roomList = document.getElementById("roomList");
  roomList.innerHTML = "";

  currentScenario.rooms.forEach(room => {
    const btn = document.createElement("button");
    btn.className = "btn room-btn";
    btn.textContent = `🔍 Enter ${room.name}`;
    btn.onclick = () => enterRoom(room);
    roomList.appendChild(btn);
  });

  switchScreen("screen-intro", "screen-lobby");
}

function enterRoom(room) {
  playSound(clickSound);
  document.getElementById("roomTitle").textContent = room.name;
  document.getElementById("clueText").textContent = room.clue;

  if (!visitedRooms.has(room.name)) {
    visitedRooms.add(room.name);
    score += 10;
    playSound(clueSound);
    updateScoreDisplay();
  } else {
    score -= 5;
    updateScoreDisplay();
  }

  switchScreen("screen-lobby", "screen-room");

  if (visitedRooms.size === currentScenario.rooms.length) {
    setTimeout(() => showAccusation(), 1500);
  }
}

function returnToLobby() {
  playSound(clickSound);
  switchScreen("screen-room", "screen-lobby");
}

function showAccusation() {
  const suspectList = document.getElementById("suspectList");
  suspectList.innerHTML = "";

  currentScenario.suspects.forEach(suspect => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = suspect;
    btn.onclick = () => makeAccusation(suspect);
    suspectList.appendChild(btn);
  });

  switchScreen("screen-room", "screen-accuse");
}

function makeAccusation(suspect) {
  let resultText;
  if (suspect === currentScenario.culprit) {
    resultText = `✅ You nailed it! ${suspect} was the real culprit.`;
    score += 50;
  } else {
    resultText = `❌ Oops! ${suspect} was innocent. The real culprit was ${currentScenario.culprit}.`;
    score -= 20;
  }

  document.getElementById("endingTitle").textContent = "🎉 Case Closed";
  document.getElementById("endingText").textContent = resultText;

  const inv = document.getElementById("finalInventory");
  inv.innerHTML = "";
  currentScenario.rooms.forEach(room => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = room.clue;
    inv.appendChild(div);
  });

  document.getElementById("finalScore").textContent = `Final Score: ${score}`;
  switchScreen("screen-accuse", "screen-ending");
}
