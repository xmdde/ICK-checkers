const boardElement = document.getElementById("board") as HTMLDivElement;
const SIZE = 8;

function createBoard(): void {
  boardElement.innerHTML = "";

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      if ((row + col) % 2 === 1) {
        square.classList.add("dark");

        if (row < 3) {
          createPiece("black", square);
        } else if (row > 4) {
          createPiece("white", square);
        }
      } else {
        square.classList.add("light");
      }

      square.dataset.pos = String.fromCharCode(65 + col) + (8 - row);
      boardElement.appendChild(square);
    }
  }
}

function createPiece(color: "white" | "black", parent: HTMLElement) {
    const piece = document.createElement("div");
    piece.classList.add("piece", color);
    parent.appendChild(piece);
}

window.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
