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
