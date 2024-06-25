let fields = [null, "circle", null, null, null, null, null, null, null];

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
      if (fields[index] === "circle") {
        cellContent = "O";
      } else if (fields[index] === "cross") {
        cellContent = "X";
      }
      tableHTML += `<td><div>${cellContent}</div></td>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += "</table>";
  content.innerHTML = tableHTML;
}
