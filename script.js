let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";
let gameMode = "single";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function init() {
  showModeSelector();
}

function showModeSelector() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div id="mode-selector">
      <button class="bigger-button" onclick="startGame('single')"><span>Single Player<span/></button>
      <button class="bigger-button" onclick="startGame('multi')"><span>Two Player<span/></button>
    </div>
  `;
  document.getElementById("reset-button").style.display = "none";
  removeBackButton();
}

function startGame(mode) {
  gameMode = mode;
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "circle";
  render();
  showPlayerIndicators();
  document.getElementById("reset-button").style.display = "inline-block";
  addBackButton();
}

function showPlayerIndicators() {
  const playerIndicators = document.getElementById("player-indicators");
  playerIndicators.style.display = "flex";
}

function hidePlayerIndicators() {
  const playerIndicators = document.getElementById("player-indicators");
  playerIndicators.style.display = "none";
}

function addBackButton() {
  if (!document.getElementById("back-button")) {
    const backButton = document.createElement("button");
    backButton.id = "back-button";
    backButton.innerHTML = "&#8592;";
    backButton.onclick = function () {
      showModeSelector();
      hidePlayerIndicators();
    };
    document.querySelector(".container").appendChild(backButton);
  }
}

function removeBackButton() {
  const backButton = document.getElementById("back-button");
  if (backButton) {
    backButton.remove();
  }
}

function render() {
  const content = document.getElementById("content");
  let tableHTML = "<table>";

  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let cellContent = "";
      let cellClass = "";
      if (fields[index] === "circle") {
        cellContent = generateCircleSVG();
        cellClass = "filled";
      } else if (fields[index] === "cross") {
        cellContent = generateCrossSVG();
        cellClass = "filled";
      }
      tableHTML += `<td onclick="handleClick(${index}, this)" class="${cellClass}"><div>${cellContent}</div></td>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += "</table>";
  content.innerHTML = tableHTML;
  renderPlayerIndicators();
}

function handleClick(index, element) {
  if (
    fields[index] !== null ||
    (currentPlayer !== "circle" && gameMode === "single")
  ) {
    return;
  }

  fields[index] = currentPlayer;
  element.innerHTML = `<div>${
    currentPlayer === "circle" ? generateCircleSVG() : generateCrossSVG()
  }</div>`;
  element.classList.add("filled");
  element.onclick = null;

  const winner = checkWinner();
  if (winner) {
    drawWinningLine(winner);
    disableBoard();
    highlightWinner();
    return;
  }

  if (gameMode === "single") {
    currentPlayer = "cross";
    updatePlayerIndicators();
    setTimeout(makeAIMove, 500);
  } else {
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
    updatePlayerIndicators();
  }
}

function makeAIMove() {
  const emptyIndices = fields
    .map((value, index) => (value === null ? index : null))
    .filter((value) => value !== null);
  if (emptyIndices.length === 0) {
    return;
  }

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      fields[a] === "cross" &&
      fields[a] === fields[b] &&
      fields[c] === null
    ) {
      fields[c] = "cross";
      updateCell(c);
      return;
    }
    if (
      fields[a] === "cross" &&
      fields[a] === fields[c] &&
      fields[b] === null
    ) {
      fields[b] = "cross";
      updateCell(b);
      return;
    }
    if (
      fields[b] === "cross" &&
      fields[b] === fields[c] &&
      fields[a] === null
    ) {
      fields[a] = "cross";
      updateCell(a);
      return;
    }
  }

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      fields[a] === "circle" &&
      fields[a] === fields[b] &&
      fields[c] === null
    ) {
      fields[c] = "cross";
      updateCell(c);
      return;
    }
    if (
      fields[a] === "circle" &&
      fields[a] === fields[c] &&
      fields[b] === null
    ) {
      fields[b] = "cross";
      updateCell(b);
      return;
    }
    if (
      fields[b] === "circle" &&
      fields[b] === fields[c] &&
      fields[a] === null
    ) {
      fields[a] = "cross";
      updateCell(a);
      return;
    }
  }

  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  fields[randomIndex] = "cross";
  updateCell(randomIndex);
}

function updateCell(index) {
  const cell = document.querySelectorAll("td")[index];
  cell.innerHTML = `<div>${generateCrossSVG()}</div>`;
  cell.classList.add("filled");
  cell.onclick = null;

  const winner = checkWinner();
  if (winner) {
    drawWinningLine(winner);
    disableBoard();
    highlightWinner();
    return;
  }

  currentPlayer = "circle";
  updatePlayerIndicators();
}

function renderPlayerIndicators() {
  const circleIndicator = document.getElementById("circle-indicator");
  const crossIndicator = document.getElementById("cross-indicator");
  circleIndicator.innerHTML = generateCircleSVG(50, 50);
  crossIndicator.innerHTML = generateCrossSVG(50, 50);
  circleIndicator.classList.add("indicator");
  crossIndicator.classList.add("indicator");
}

function updatePlayerIndicators() {
  const circleIndicator = document.getElementById("circle-indicator");
  const crossIndicator = document.getElementById("cross-indicator");

  if (currentPlayer === "circle") {
    circleIndicator.classList.remove("reduced-opacity");
    crossIndicator.classList.add("reduced-opacity");
  } else {
    circleIndicator.classList.add("reduced-opacity");
    crossIndicator.classList.remove("reduced-opacity");
  }
}

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combination;
    }
  }

  return null;
}

function drawWinningLine(winningCombination) {
  const table = document.querySelector("table");
  const startCell =
    table.rows[Math.floor(winningCombination[0] / 3)].cells[
      winningCombination[0] % 3
    ];
  const endCell =
    table.rows[Math.floor(winningCombination[2] / 3)].cells[
      winningCombination[2] % 3
    ];

  const line = document.createElement("div");
  line.classList.add("winning-line");

  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();
  const tableRect = table.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2 - tableRect.left;
  const startY = startRect.top + startRect.height / 2 - tableRect.top;
  const endX = endRect.left + endRect.width / 2 - tableRect.left;
  const endY = endRect.top + endRect.height / 2 - tableRect.top;

  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const length = Math.hypot(endX - startX, endY - startY);

  line.style.width = `${length}px`;
  line.style.height = "4px";
  line.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  line.style.position = "absolute";
  line.style.top = `${startY}px`;
  line.style.left = `${startX}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.transformOrigin = "0 50%";
  line.style.zIndex = "1";

  table.appendChild(line);
}

function disableBoard() {
  const table = document.querySelector("table");
  table.classList.add("disabled");
}

function highlightWinner() {
  const circleIndicator = document.getElementById("circle-indicator");
  const crossIndicator = document.getElementById("cross-indicator");

  if (currentPlayer === "circle") {
    circleIndicator.classList.add("glow");
    crossIndicator.classList.add("reduced-opacity");
  } else {
    crossIndicator.classList.add("glow");
    circleIndicator.classList.add("reduced-opacity");
  }
}

function resetGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "circle";
  render();
  updatePlayerIndicators();
  const table = document.querySelector("table");
  table.classList.remove("disabled");

  const circleIndicator = document.getElementById("circle-indicator");
  const crossIndicator = document.getElementById("cross-indicator");
  circleIndicator.classList.remove("glow");
  crossIndicator.classList.add("reduced-opacity");
  crossIndicator.classList.remove("glow");
}

function generateCircleSVG(width = 110, height = 110) {
  const svgHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00B0EF;stop-opacity:1" />
                <stop offset="100%" style="stop-color:white;stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="35" cy="35" r="30" stroke="url(#circleGradient)" stroke-width="5" fill="none">
            <animate
                attributeName="stroke-dasharray"
                from="0, 188.4"
                to="188.4, 0"
                dur="0.3s"
                fill="freeze"
            />
        </circle>
    </svg>
  `;
  return svgHTML;
}

function generateCrossSVG(width = 110, height = 110) {
  const svgHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,165,0);stop-opacity:1" />
            </linearGradient>
        </defs>
        <line x1="15" y1="15" x2="55" y2="55" stroke="url(#grad1)" stroke-width="5">
            <animate
                attributeName="stroke-dasharray"
                from="0, 56.57"
                to="56.57, 0"
                dur="0.2s"
                fill="freeze"
            />
        </line>
        <line x1="55" y1="15" x2="15" y2="55" stroke="url(#grad1)" stroke-width="5">
            <animate
                attributeName="stroke-dasharray"
                from="0, 56.57"
                to="56.57, 0"
                dur="0.3s"
                fill="freeze"
            />
        </line>
    </svg>
  `;
  return svgHTML;
}

window.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);
