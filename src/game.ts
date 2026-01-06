interface GameState {
  currentPlayer: "white" | "black";
  selected: string | null;
}

export const gameState: GameState = {
  currentPlayer: "white",
  selected: null
};

const boardElement = document.getElementById("board") as HTMLDivElement;

export function executeMove(fromPos: string, toPos: string): boolean {
    const fromSquare = document.querySelector(`[data-pos="${fromPos}"]`);
    const toSquare = document.querySelector(`[data-pos="${toPos}"]`);

    if (!fromSquare || !toSquare) {
        console.warn("Nie znaleziono pól na planszy.");
        return false;
    }

    const piece = fromSquare.querySelector(".piece");
    if (!piece) {
        console.warn(`Brak pionka na polu ${fromPos}`);
        return false;
    }

    if (toSquare.children.length > 0) {
        console.warn(`Pole ${toPos} jest zajęte.`);
        return false;
    }

    toSquare.appendChild(piece);
    console.log(`Przesunięto z ${fromPos} na ${toPos}`);

    gameState.currentPlayer = gameState.currentPlayer === "white" ? "black" : "white";
    return true;
}

boardElement.addEventListener("click", (e) => {
  const square = (e.target as HTMLElement).closest(".square") as HTMLDivElement;
  if (!square) return;
  console.log("Kliknięto:", square.dataset.pos);
});
