export interface GameState {
  currentPlayer: "white" | "black";
}

export const gameState: GameState = {
  currentPlayer: "white"
};

// --- POMOCNICZE FUNKCJE MATEMATYCZNE ---

// Zamienia "A3" na {col: 0, row: 5} (dla tablicy 0-7)
function parsePos(pos: string) {
  const colChar = pos.charAt(0).toUpperCase(); // "A"
  const rowChar = pos.substring(1);            // "3"

  const col = colChar.charCodeAt(0) - 65;      // A=0, B=1...
  const row = 8 - parseInt(rowChar);           // 8->0, 1->7

  return { col, row };
}

// Pobiera kolor pionka na danym polu (lub null, jeśli pusto)
function getPieceColor(square: HTMLElement | null): "white" | "black" | null {
  if (!square) return null;
  const piece = square.querySelector(".piece");
  if (!piece) return null;
  return piece.classList.contains("white") ? "white" : "black";
}

// Sprawdza, czy to Damka (King)
function isKing(square: HTMLElement): boolean {
  const piece = square.querySelector(".piece");
  return piece ? piece.classList.contains("king") : false;
}

// --- GŁÓWNA LOGIKA RUCHU ---

export function executeMove(fromPos: string, toPos: string): boolean {
    const fromSquare = document.querySelector(`[data-pos="${fromPos}"]`) as HTMLDivElement;
    const toSquare = document.querySelector(`[data-pos="${toPos}"]`) as HTMLDivElement;

    if (!fromSquare || !toSquare) {
        console.warn("Błąd: Nie znaleziono pól.");
        return false;
    }
    
    // --- WALIDACJA RUCHU ---

    const piece = fromSquare.querySelector(".piece") as HTMLDivElement;
    if (!piece) {
        console.warn("Błąd: Pole startowe jest puste.");
        return false;
    }

    const pieceColor = piece.classList.contains("white") ? "white" : "black";
    if (pieceColor !== gameState.currentPlayer) {
        console.warn(`Błąd: To nie jest tura gracza ${pieceColor}.`);
        return false;
    }

    if (toSquare.children.length > 0) {
        console.warn("Błąd: Pole docelowe jest zajęte.");
        return false;
    }

    // --- RUCH ---
    const start = parsePos(fromPos);
    const end = parsePos(toPos);

    const dCol = end.col - start.col; // Różnica kolumn
    const dRow = end.row - start.row; // Różnica wierszy

    // Zasada: Ruch musi być po skosie (zmiana wiersza = zmiana kolumny)
    if (Math.abs(dCol) !== Math.abs(dRow)) {
        console.warn("Błąd: Ruch nie jest po skosie.");
        return false;
    }

    const isSimpleMove = Math.abs(dRow) === 1;
    const isJump = Math.abs(dRow) === 2;
    
    const pieceIsKing = piece.classList.contains("king");

    if (!pieceIsKing && !isJump) {
        if (pieceColor === "white" && dRow > 0) return false; // Biały nie może w dół
        if (pieceColor === "black" && dRow < 0) return false; // Czarny nie może w górę
    }

    // --- WYKONANIE RUCHU ---

    if (isSimpleMove) {
        movePieceDom(piece, toSquare);
        checkPromotion(piece, end.row, pieceColor);
        endTurn();
        return true;
    } 
    else if (isJump) {
        // Skok o 2 pola - sprawdzamy bicie
        const midCol = start.col + (dCol / 2);
        const midRow = start.row + (dRow / 2);

        // Odtwarzamy nazwe pola środkowego (np. "B4")
        const midPosChar = String.fromCharCode(65 + midCol); // 0 -> A
        const midPosNum = 8 - midRow;                        // 0 -> 8
        const midPos = midPosChar + midPosNum;

        const midSquare = document.querySelector(`[data-pos="${midPos}"]`) as HTMLDivElement;
        const enemyColor = getPieceColor(midSquare);

        if (enemyColor && enemyColor !== pieceColor) {
            const enemyPiece = midSquare.querySelector(".piece");
            if (enemyPiece) midSquare.removeChild(enemyPiece);
            
            movePieceDom(piece, toSquare);
            checkPromotion(piece, end.row, pieceColor);
            endTurn();
            return true;
        } else {
            console.warn("Błąd: Próba skoku bez bicia (puste pole lub własny pion).");
            return false;
        }
    }

    console.warn("Błąd: Niedozwolony zasięg ruchu.");
    return false;
}

function movePieceDom(piece: HTMLElement, targetSquare: HTMLElement) {
    targetSquare.appendChild(piece);
}

function endTurn() {
    gameState.currentPlayer = gameState.currentPlayer === "white" ? "black" : "white";
    console.log(`Tura zmieniona. Teraz: ${gameState.currentPlayer}`);
}

function checkPromotion(piece: HTMLElement, rowRowIndex: number, color: string) {
    if ((color === "white" && rowRowIndex === 0) || 
        (color === "black" && rowRowIndex === 7)) {
        piece.classList.add("king");
        console.log("Promocja!");
    }
}
