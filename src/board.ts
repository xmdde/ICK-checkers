(() => {
const boardElement = document.getElementById("board") as HTMLDivElement;
const SIZE = 8;

function createBoard(): void {
  boardElement.innerHTML = "";

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 1 ? "dark" : "light");
      square.dataset.pos = String.fromCharCode(65 + col) + (8 - row);
      boardElement.appendChild(square);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
})();