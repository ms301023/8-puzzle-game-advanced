import { useState, useEffect } from "react";
import "./App.css";
import { motion } from "framer-motion";

function App() {
  const [solutionPath, setSolutionPath] = useState([]);
const [isSolving, setIsSolving] = useState(false);
  const [optimalMoves, setOptimalMoves] = useState(null);
  const [selectedHeuristic, setSelectedHeuristic] = useState("manhattan");
  const [mode, setMode] = useState("aam");
  const [board, setBoard] = useState([
    1,2,3,
    4,5,6,
    7,8,0
  ]);
  const [hasWon, setHasWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const goal = [1,2,3,4,5,6,7,8,0];

  // 🔥 Fix background properly
  useEffect(() => {
    if (mode === "mentos") {
      document.body.style.background = "#050a14";
    } else {
      document.body.style.background =
        "linear-gradient(135deg, #c7e9ff, #ffd6e8, #dbeafe)";
    }
  }, [mode]);

  const moveTile = (index) => {
    const blankIndex = board.indexOf(0);

    const validMoves = [
      blankIndex - 1,
      blankIndex + 1,
      blankIndex - 3,
      blankIndex + 3
    ];

    if (blankIndex % 3 === 0)
      validMoves.splice(validMoves.indexOf(blankIndex - 1), 1);

    if (blankIndex % 3 === 2)
      validMoves.splice(validMoves.indexOf(blankIndex + 1), 1);

    if (validMoves.includes(index)) {
      const newBoard = [...board];
      [newBoard[index], newBoard[blankIndex]] =
        [newBoard[blankIndex], newBoard[index]];

      setBoard(newBoard);
      setMoves(moves + 1);

      if (newBoard.every((val, i) => val === goal[i])) {
        setHasWon(true);
      }
    }
  };

  // 🧠 Heuristics
  const manhattanDistance = (state) => {
    let distance = 0;

    state.forEach((tile, index) => {
      if (tile === 0) return;

      const goalIndex = goal.indexOf(tile);

      const x1 = Math.floor(index / 3);
      const y1 = index % 3;

      const x2 = Math.floor(goalIndex / 3);
      const y2 = goalIndex % 3;

      distance += Math.abs(x1 - x2) + Math.abs(y1 - y2);
    });

    return distance;
  };


  const aStar = (start) => {
  const serialize = (state) => state.join(",");
  const goalState = goal.join(",");

  const open = [];
  const visited = new Set();

  open.push({
    state: start,
    g: 0,
    h: manhattanDistance(start),
    f: manhattanDistance(start),
    parent: null
  });

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    const currentKey = serialize(current.state);

    if (currentKey === goalState) {
      // reconstruct path
      const path = [];
      let node = current;

      while (node) {
        path.unshift(node.state);
        node = node.parent;
      }

      return path; // return full path
    }

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    const blankIndex = current.state.indexOf(0);
    const possibleMoves = [];

    if (blankIndex % 3 !== 0) possibleMoves.push(blankIndex - 1);
    if (blankIndex % 3 !== 2) possibleMoves.push(blankIndex + 1);
    if (blankIndex - 3 >= 0) possibleMoves.push(blankIndex - 3);
    if (blankIndex + 3 < 9) possibleMoves.push(blankIndex + 3);

    for (let move of possibleMoves) {
      const newState = [...current.state];
      [newState[blankIndex], newState[move]] =
        [newState[move], newState[blankIndex]];

      const newKey = serialize(newState);
      if (!visited.has(newKey)) {
        const g = current.g + 1;
        const h = manhattanDistance(newState);

        open.push({
          state: newState,
          g,
          h,
          f: g + h,
          parent: current
        });
      }
    }
  }

  return [];
};

  const misplacedTiles = (state) => {
    return state.filter((tile, i) => tile !== 0 && tile !== goal[i]).length;
  };

  const shuffleBoard = () => {
    let newBoard = [...board];

    for (let i = 0; i < 100; i++) {
      const blankIndex = newBoard.indexOf(0);
      const possibleMoves = [];

      if (blankIndex % 3 !== 0) possibleMoves.push(blankIndex - 1);
      if (blankIndex % 3 !== 2) possibleMoves.push(blankIndex + 1);
      if (blankIndex - 3 >= 0) possibleMoves.push(blankIndex - 3);
      if (blankIndex + 3 < 9) possibleMoves.push(blankIndex + 3);

      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      [newBoard[blankIndex], newBoard[randomMove]] =
        [newBoard[randomMove], newBoard[blankIndex]];
    }

    setBoard(newBoard);
setMoves(0);

// compute optimal moves
setTimeout(() => {
  const path = aStar(newBoard);
  setSolutionPath(path);
  setOptimalMoves(path.length - 1);
}, 100);

    setHasWon(false);
  };

  const showSolution = () => {
  if (!solutionPath.length) return;

  setIsSolving(true);

  let i = 0;

  const interval = setInterval(() => {
    setBoard(solutionPath[i]);
    i++;

    if (i >= solutionPath.length) {
      clearInterval(interval);
      setIsSolving(false);
    }
  }, 500); // speed of animation
};

  return (
    <div className={`container ${mode}`}>

      {/* Toggle */}
      <div className="mode-switch">
        <div
          className={`switch ${mode === "mentos" ? "active" : ""}`}
          onClick={() => setMode(mode === "aam" ? "mentos" : "aam")}
        >
          <div className="slider">
            {mode === "aam" ? "😉" : "😎"}
          </div>
        </div>
      </div>

      <h1>8 Puzzle Game</h1>
      <p className="subtitle">
        {mode === "aam" ? "AAM ZINDAGI 😉" : "MENTOS ZINDAGI 😎"}
      </p>

      {/* AAM MODE */}
      {mode === "aam" && (
        <>
          <p className="moves">Moves: {moves}</p>

          <button className="shuffle-btn" onClick={shuffleBoard}>
            Shuffle 🔀
          </button>

          <div className="grid">
            {board.map((tile, index) => (
              <motion.div
                layout
                key={tile}
                className={`tile ${tile === 0 ? "blank" : ""}`}
                onClick={() => !isSolving && moveTile(index)}
                style={{
                  background: tile === 0
                    ? "transparent"
                    : `hsl(${tile * 40}, 70%, 85%)`
                }}
              >
                {tile !== 0 ? tile : ""}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* MENTOS MODE */}
      {mode === "mentos" && (
  <div className="mentos-dashboard">

    {/* LEFT PANEL */}
    <div className="left-panel panel-box">
      <h2>HEURISTICS</h2>

      <div className="heuristic-row">
        <span>Manhattan Distance:</span>
        <span className="heuristic-value">
          {manhattanDistance(board)}
        </span>
      </div>

      <div className="heuristic-row">
        <span>Misplaced Tiles:</span>
        <span className="heuristic-value">
          {misplacedTiles(board)}
        </span>
      </div>

      <div className="heuristic-row">
  <span>Optimal (A*):</span>
  <span className="heuristic-value">
    {optimalMoves !== null ? optimalMoves : "..."}
  </span>
</div>
    </div>

    {/* CENTER BOARD */}
<div className="center-board">

  <div className="center-header">
    <p className="moves-mentos">Moves: {moves}</p>

    <button className="shuffle-mentos" onClick={shuffleBoard}>
      Shuffle
    </button>
    <button
  className="shuffle-mentos"
  onClick={showSolution}
>
  Show Solution
</button>
    
  </div>

  <div className="grid neon-grid">
    {board.map((tile, index) => (
      <motion.div
        layout
        key={tile}
        className={`tile neon-tile ${tile === 0 ? "blank" : ""}`}
        onClick={() => moveTile(index)}
      >
        {tile !== 0 ? tile : ""}
      </motion.div>
    ))}
  </div>
</div>

    {/* RIGHT PANEL */}
    <div className="right-panel panel-box">
      <h2>HACK IT</h2>
      <ul>
        <li><a href="https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/" target="_blank" rel="noreferrer">BFS</a></li>
        <li><a href="https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/" target="_blank" rel="noreferrer">DFS</a></li>
        <li><a href="https://www.geeksforgeeks.org/a-search-algorithm/" target="_blank" rel="noreferrer">A*</a></li>
        <li><a href="https://www.geeksforgeeks.org/iterative-deepening-searchids-iterative-deepening-depth-first-searchiddfs/" target="_blank" rel="noreferrer">IDDFS</a></li>
        <li><a href="https://www.geeksforgeeks.org/artificial-intelligence/uniform-cost-search-ucs-in-ai/" target="_blank" rel="noreferrer">UCS</a></li>
      </ul>
    </div>

  </div>
)}

      {hasWon && (
        <div className="overlay">
          <div className="win-box">
            <h2>🎉 You Won!</h2>
            <p>You solved it in <strong>{moves}</strong> moves</p>
            <button onClick={shuffleBoard}>
              Play Again 🔄
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;