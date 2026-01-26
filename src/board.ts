const boardElement = document.getElementById("board") as HTMLDivElement;
const numsElement = document.getElementById("coords-nums") as HTMLDivElement;
const lettersElement = document.getElementById("coords-letters") as HTMLDivElement;
const SIZE = 8;

export function createBoard(): void {
  boardElement.innerHTML = "";
  numsElement.innerHTML = "";
  lettersElement.innerHTML = "";

  // 1. Generowanie planszy
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      if ((row + col) % 2 === 1) {
        square.classList.add("dark");
        if (row < 3) createPiece("black", square);
        else if (row > 4) createPiece("white", square);
      } else {
        square.classList.add("light");
      }
      square.dataset.pos = String.fromCharCode(65 + col) + (8 - row);
      boardElement.appendChild(square);
    }
  }

  // 2. Generowanie liczb
  for (let i = 0; i < SIZE; i++) {
    const num = document.createElement("div");
    num.textContent = (8 - i).toString();
    numsElement.appendChild(num);
  }

  // 3. Generowanie liter
  for (let i = 0; i < SIZE; i++) {
    const letDiv = document.createElement("div");
    letDiv.textContent = String.fromCharCode(65 + i);
    lettersElement.appendChild(letDiv);
  }
}

function createPiece(color: "white" | "black", parent: HTMLElement) {
  const piece = document.createElement("div");
  piece.classList.add("piece", color);
  parent.appendChild(piece);
}

export function setTheme(themeName: string) {
    if (themeName === "domyslny" || themeName === "klasyczny") {
        document.body.removeAttribute("data-theme");
    } else {
        document.body.setAttribute("data-theme", themeName);
    }
}

window.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
