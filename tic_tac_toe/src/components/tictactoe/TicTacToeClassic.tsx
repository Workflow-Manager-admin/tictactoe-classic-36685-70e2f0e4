import { component$, useSignal, $ } from "@builder.io/qwik";

/**
 * TicTacToeClassic: Main container for a 3x3 two-player Tic-Tac-Toe game.
 *
 * Features:
 * - Minimalist UI, color scheme: #ffffff (primary), #000000 (secondary), #2196f3 (accent)
 * - Centered grid, player turn indicator, win/draw detection, reset button
 */

// PUBLIC_INTERFACE
export default component$(() => {
  // Board is an array of 9 strings: "", "X", or "O"
  const board = useSignal<string[]>(Array(9).fill(""));
  // Player turn. true = "X" (Player 1), false = "O" (Player 2)
  const xIsNext = useSignal<boolean>(true);
  // Game status: '', 'win', 'draw'
  const gameStatus = useSignal<"" | "win" | "draw">("");
  // Winning line indices if any
  const winningLine = useSignal<number[] | null>(null);

  // PUBLIC_INTERFACE
  const resetGame = $(() => {
    board.value = Array(9).fill("");
    xIsNext.value = true;
    gameStatus.value = "";
    winningLine.value = null;
  });

  // PUBLIC_INTERFACE
  const checkGameState = $(function () {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (
        board.value[a] &&
        board.value[a] === board.value[b] &&
        board.value[a] === board.value[c]
      ) {
        gameStatus.value = "win";
        winningLine.value = line;
        return;
      }
    }
    if (board.value.every(cell => cell)) {
      gameStatus.value = "draw";
      winningLine.value = null;
    }
  });

  const handleCellClick = $(async (index: number) => {
    if (board.value[index] !== "" || gameStatus.value) {
      return;
    }
    board.value[index] = xIsNext.value ? "X" : "O";
    await checkGameState();
    if (!gameStatus.value) {
      xIsNext.value = !xIsNext.value;
    }
  });

  // UI: Player indicator & status
  let statusMessage = "";
  if (gameStatus.value === "win") {
    statusMessage = `Player ${xIsNext.value ? "1 (X)" : "2 (O)"} wins!`;
  } else if (gameStatus.value === "draw") {
    statusMessage = "It's a draw!";
  } else {
    statusMessage = `Player ${xIsNext.value ? "1 (X)" : "2 (O)"}'s turn`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(50,50,60,0.05)",
          padding: "2.5rem 2rem 2rem 2rem",
          minWidth: "320px",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Player turn/status */}
        <div
          style={{
            marginBottom: "2.4rem",
            fontWeight: "bold",
            fontSize: "1.25rem",
            letterSpacing: "0.03em",
            color: "#000",
            minHeight: "2.2em"
          }}
          aria-label="player-turn-indicator"
        >
          {statusMessage}
        </div>
        {/* 3x3 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 64px)",
            gridTemplateRows: "repeat(3, 64px)",
            gap: "0.5rem",
            marginBottom: "2.6rem",
            background: "#fff",
          }}
        >
          {board.value.map((cell, i) => {
            const isWinCell =
              gameStatus.value === "win" && winningLine.value?.includes(i);
            return (
              <button
                key={i}
                aria-label={`cell-${i}`}
                disabled={!!cell || !!gameStatus.value}
                onClick$={() => handleCellClick(i)}
                style={{
                  background: "#ffffff",
                  color: cell === "X"
                    ? "#2196f3"
                    : cell === "O"
                    ? "#000000"
                    : "#999",
                  border: isWinCell
                    ? "2.5px solid #2196f3"
                    : "2px solid #000000",
                  outline: "none",
                  borderRadius: "12px",
                  boxShadow: isWinCell
                    ? "0 0 0 2px #2196f3"
                    : "none",
                  fontSize: "2.5rem",
                  fontFamily: "inherit",
                  width: "64px",
                  height: "64px",
                  cursor: cell || gameStatus.value ? "default" : "pointer",
                  transition: "border 0.18s, box-shadow 0.18s"
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>
        {/* Reset button */}
        <button
          onClick$={resetGame}
          style={{
            marginTop: "1.3rem",
            background: "#2196f3",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "0.85em 2em",
            fontSize: "1.05rem",
            fontWeight: 600,
            letterSpacing: "0.025em",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          aria-label="reset-game"
        >
          Reset
        </button>
      </div>
    </div>
  );
});
