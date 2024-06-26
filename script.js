let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";

function init() {
  render();
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
}

function handleClick(index, element) {
  if (fields[index] !== null) {
    return;
  }

  fields[index] = currentPlayer;
  if (currentPlayer === "circle") {
    element.innerHTML = `<div>${generateCircleSVG()}</div>`;
    currentPlayer = "cross";
  } else {
    element.innerHTML = `<div>${generateCrossSVG()}</div>`;
    currentPlayer = "circle";
  }
  element.classList.add("filled");
  element.onclick = null;

  const winner = checkWinner();
  if (winner) {
    drawWinningLine(winner);
  }
}

function checkWinner() {
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
  line.style.height = "8px";
  line.style.backgroundColor = "white";
  line.style.position = "absolute";
  line.style.top = `${startY}px`;
  line.style.left = `${startX}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.transformOrigin = "0 50%";
  line.style.zIndex = "1";

  table.appendChild(line);
}

function generateCircleSVG() {
  const svgHTML = `
    <svg width="150" height="150" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
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

function generateCrossSVG() {
  const svgHTML = `
        <svg width="150" height="150" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
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
