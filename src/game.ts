interface GameState {
  currentPlayer: "white" | "black";
  selected: string | null;
}

export const gameState: GameState = {
  currentPlayer: "white",
  selected: null
};

const boardElement = document.getElementById("board") as HTMLDivElement;

boardElement.addEventListener("click", (e) => {
  const square = (e.target as HTMLElement).closest(".square") as HTMLDivElement;
  if (!square) return;

  const pos = square.dataset.pos;
  console.log("Kliknięto pole:", pos);
});
