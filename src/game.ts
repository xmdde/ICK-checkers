import { createBoard } from "./board.js";

export interface GameState {
  currentPlayer: "white" | "black";
  isGameOver: boolean;
}

export let gameState: GameState = {
  currentPlayer: "white",
  isGameOver: false
};

export function resetGame() {
    gameState.currentPlayer = "white";
    gameState.isGameOver = false;
    createBoard();
    console.log("Gra zresetowana.");
}

export interface MoveResult {
    success: boolean;
    message?: string;
    captured?: boolean;
    winner?: "white" | "black" | null;
}

function parsePos(pos: string) {
    const colChar = pos.charAt(0).toUpperCase();
    const rowChar = pos.substring(1);
    const col = colChar.charCodeAt(0) - 65;
    const row = 8 - parseInt(rowChar);
    return { col, row };
}

function getSquare(col: number, row: number): HTMLDivElement | null {
    const colChar = String.fromCharCode(65 + col);
    const rowNum = 8 - row;
    return document.querySelector(`[data-pos="${colChar}${rowNum}"]`) as HTMLDivElement;
}

function getPieceColor(square: HTMLElement | null): "white" | "black" | null {
    if (!square) return null;
    const piece = square.querySelector(".piece");
    if (!piece) return null;
    return piece.classList.contains("white") ? "white" : "black";
}

function getPiecesBetween(start: {col: number, row: number}, end: {col: number, row: number}) {
    const piecesFound: { square: HTMLDivElement, color: string }[] = [];
    
    const dCol = end.col - start.col;
    const dRow = end.row - start.row;
    
    const stepCol = dCol > 0 ? 1 : -1;
    const stepRow = dRow > 0 ? 1 : -1;

    let currentCol = start.col + stepCol;
    let currentRow = start.row + stepRow;

    while (currentCol !== end.col && currentRow !== end.row) {
        const sq = getSquare(currentCol, currentRow);
        if (sq) {
            const color = getPieceColor(sq);
            if (color) {
                piecesFound.push({ square: sq, color: color });
            }
        }
        currentCol += stepCol;
        currentRow += stepRow;
    }
    return piecesFound;
}

// --- GŁÓWNA LOGIKA RUCHU ---
export function executeMove(fromPos: string, toPos: string): MoveResult {
    if (gameState.isGameOver) return { success: false, message: "Gra skończona. Powiedz 'Nowa gra'." };

    const start = parsePos(fromPos);
    const end = parsePos(toPos);
    const fromSquare = getSquare(start.col, start.row);
    const toSquare = getSquare(end.col, end.row);

    // 1. Podstawowa walidacja pól
    if (!fromSquare || !toSquare) return { success: false, message: "Nieprawidłowe pola." };
    
    const piece = fromSquare.querySelector(".piece") as HTMLDivElement;
    if (!piece) return { success: false, message: "Puste pole startowe." };

    const pieceColor = piece.classList.contains("white") ? "white" : "black";
    if (pieceColor !== gameState.currentPlayer) return { success: false, message: `Teraz ruch ma ${gameState.currentPlayer}.` };

    if (toSquare.children.length > 0) return { success: false, message: "Pole docelowe zajęte." };

    // 2. Walidacja geometrii (musi być skos)
    const dCol = end.col - start.col;
    const dRow = end.row - start.row;
    if (Math.abs(dCol) !== Math.abs(dRow)) return { success: false, message: "Ruch tylko po skosie!" };

    const isKing = piece.classList.contains("king");

    if (!isKing) {
        const isSimpleMove = Math.abs(dRow) === 1;
        const isJump = Math.abs(dRow) === 2;

        // A. Ruch zwykły (1 pole)
        if (isSimpleMove) {
            if (pieceColor === "white" && dRow > 0) return { success: false, message: "Pionki tylko do przodu." };
            if (pieceColor === "black" && dRow < 0) return { success: false, message: "Pionki tylko do przodu." };

            movePieceDom(piece, toSquare);
            checkPromotion(piece, end.row, pieceColor);
            endTurn();
            return { success: true, message: `Ruch na ${toPos}` };
        }
        
        // B. Bicie (2 pola)
        if (isJump) {
            const midCol = start.col + (dCol / 2);
            const midRow = start.row + (dRow / 2);
            const midSquare = getSquare(midCol, midRow);
            const enemyColor = getPieceColor(midSquare);

            if (enemyColor && enemyColor !== pieceColor) {
                // Wykonaj bicie
                removeEnemyPiece(midSquare!);
                movePieceDom(piece, toSquare);
                checkPromotion(piece, end.row, pieceColor);
                return finalizeMove(true, toPos);
            } else {
                return { success: false, message: "Nie możesz skakać bez bicia." };
            }
        }
        
        return { success: false, message: "Za daleko dla zwykłego piona." };
    }

    else {
        const obstacles = getPiecesBetween(start, end);

        // Ruch bez bicia (droga musi być pusta)
        if (obstacles.length === 0) {
            movePieceDom(piece, toSquare);
            endTurn();
            return { success: true, message: `Damka na ${toPos}` };
        }

        // Bicie damką (dokładnie jeden wróg na drodze)
        if (obstacles.length === 1) {
            const obstacle = obstacles[0];
            
            if (obstacle.color !== pieceColor) {
                removeEnemyPiece(obstacle.square);
                movePieceDom(piece, toSquare);
                return finalizeMove(true, toPos);
            } else {
                return { success: false, message: "Nie możesz przeskoczyć własnego piona." };
            }
        }

        return { success: false, message: "Droga zablokowana przez wiele pionków." };
    }
}

function removeEnemyPiece(square: HTMLElement) {
    const enemy = square.querySelector(".piece");
    if (enemy) square.removeChild(enemy);
}

function finalizeMove(captured: boolean, toPos: string): MoveResult {
    const winner = checkWinCondition();
    if (winner) {
        gameState.isGameOver = true;
        return { success: true, message: `Wygrywają ${winner === "white" ? "Białe" : "Czarne"}!`, winner };
    }
    endTurn();
    return { success: true, message: captured ? `Bicie na ${toPos}` : `Ruch na ${toPos}`, captured };
}

function movePieceDom(piece: HTMLElement, targetSquare: HTMLElement) {
    targetSquare.appendChild(piece);
}

function endTurn() {
    gameState.currentPlayer = gameState.currentPlayer === "white" ? "black" : "white";
}

function checkPromotion(piece: HTMLElement, rowIndex: number, color: string) {
    if (piece.classList.contains("king")) return;

    if ((color === "white" && rowIndex === 0) || (color === "black" && rowIndex === 7)) {
        piece.classList.add("king");
        console.log("PROMOCJA! Mamy damkę.");
    }
}

function checkWinCondition(): "white" | "black" | null {
    const whitePieces = document.querySelectorAll(".piece.white").length;
    const blackPieces = document.querySelectorAll(".piece.black").length;
    if (blackPieces === 0) return "white";
    if (whitePieces === 0) return "black";
    return null;
}