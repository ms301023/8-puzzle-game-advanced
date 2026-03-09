# 🧠 8-Puzzle AI Visualizer

An interactive **8-Puzzle game and AI search visualizer** built with **React + Vite**.  
The project features two modes — a normal playable puzzle and an advanced **AI analysis mode** that demonstrates heuristic search and optimal pathfinding using the **A\* algorithm**.

---

## 🎮 Modes

### 😄 Aam Zindagi (Normal Mode)

Play the classic 8-puzzle game.

Features:
- Click tiles to move them
- Shuffle the board
- Track number of moves
- Win popup when solved

---

### 😎 Mentos Zindagi (AI Mode)

AI visualization mode designed to demonstrate search algorithms.

Features:
- Dark hacker-style UI
- Heuristic evaluation
- Optimal solution calculation
- Animated solution playback
- AI search references

Displayed metrics:

- **Manhattan Distance heuristic**
- **Misplaced Tiles heuristic**
- **Optimal moves computed using A\***

---

## 🤖 AI Algorithms Implemented

### A\* Search

The solver uses the A\* search algorithm where:



Where:

- **g(n)** = cost from start node  
- **h(n)** = heuristic estimate to goal  

Two heuristics are implemented:

---

### Manhattan Distance



Measures the total grid distance of each tile from its goal position.

---

### Misplaced Tiles

Counts the number of tiles that are not in their goal position.

---

## ✨ Features

- Interactive 8-puzzle gameplay
- Dual-mode UI (Game + AI visualization)
- A\* search implementation
- Optimal solution computation
- Solution path reconstruction
- Step-by-step animated solving
- Heuristic comparison
- Cyber-style AI dashboard
- Responsive UI

---

## 🧱 Tech Stack

- **React**
- **Vite**
- **JavaScript**
- **Framer Motion**
- **CSS**

---

## 🚀 How to Run Locally

Clone the repository

```bash
git clone https://github.com/yourusername/8-puzzle-ai-visualizer.git
