# Sudoku Solver - Full Stack Application

A modern web-based Sudoku solver using backtracking and MRV (Minimum Remaining Values) heuristic optimization algorithms.

## Project Structure

```
DSA Project/
├── backend/
│   ├── package.json
│   ├── server.js           # Express API server
│   ├── sudokuSolver.js     # Sudoku solver logic
│   └── sudoku.cpp          # Original C++ implementation
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── App.css         # Styling
│   └── public/
└── README.md
```

## Features

- **Interactive Sudoku Grid**: Enter your puzzle
- ⚡ **Two Solving Algorithms**:
  - Basic Backtracking
  - MRV (Minimum Remaining Values) Heuristic - faster algorithm
- **Performance Metrics**: 
  - Nodes visited
  - Backtracks count
  - Solve time in milliseconds
- **Modern UI**: Built with React and Vite
- **Full Stack**: Node.js/Express backend with REST API

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Backend Server

From the `backend` directory:
```bash
npm start
```

The server will run on `http://localhost:5000`

You should see:
```
Sudoku Solver Backend running on http://localhost:5000
```

### 3. Start the Frontend Development Server

From the `frontend` directory (in a new terminal):
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

1. **Enter Puzzle**: Click on the grid cells and enter numbers (1-9)
   - Empty cells should be left blank

2. **Choose Algorithm**: Select from the dropdown:
   - **Basic Backtracking**: Standard recursive backtracking
   - **MRV Heuristic**: Chooses cells with minimum remaining values (usually faster)

3. **Solve**: Click the "Solve" button to solve the puzzle

4. **View Results**: 
   - The solved puzzle will appear in the grid
   - Performance metrics show computational effort

5. **Reset**: Click "Reset" to clear the board and start over

## Example Puzzle

Try this classic puzzle:
```
5 3 0 | 0 7 0 | 0 0 0
6 0 0 | 1 9 5 | 0 0 0
0 9 8 | 0 0 0 | 0 6 0
------+-------+------
8 0 0 | 0 6 0 | 0 0 3
4 0 0 | 8 0 3 | 0 0 1
7 0 0 | 0 2 0 | 0 0 6
------+-------+------
0 6 0 | 0 0 0 | 2 8 0
0 0 0 | 4 1 9 | 0 0 5
0 0 0 | 0 8 0 | 0 7 9
```

## API Endpoints

### POST `/api/solve`
Solves a Sudoku puzzle.

**Request:**
```json
{
  "board": [[5,3,0,...],[6,0,0,...],...]
  "algorithm": "basic" or "mrv"
}
```

**Response:**
```json
{
  "solved": true,
  "board": [[5,3,4,...],[6,1,7,...],...]
  "stats": {
    "nodesVisited": 12543,
    "backtracks": 245,
    "timeMs": 15
  }
}
```

### GET `/api/health`
Checks if the backend is running.

## Algorithm Comparison

### Basic Backtracking
- **Time Complexity**: O(9^(n×n)) worst case
- **Space Complexity**: O(n×n) for recursion stack
- **Best For**: Learning, small puzzles
- **Speed**: Slower, more nodes visited

### MRV (Minimum Remaining Values) Heuristic
- **Constraint Propagation**: Picks cells with fewest possibilities
- **Reduces Search Space**: Fewer backtracks needed
- **Best For**: Most real-world puzzles
- **Speed**: Typically 10-100× faster than basic backtracking

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend server is running: `npm start` in the `backend` directory
- Check that port 5000 is available
- No firewall blocking localhost:5000

### Frontend not updating
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Restart the development server

### Solver very slow
- Try the MRV Heuristic algorithm instead
- Ensure you don't have other CPU-intensive apps running

## Technologies Used

**Backend:**
- Node.js
- Express.js
- CORS middleware

**Frontend:**
- React 19
- Vite
- Axios (HTTP client)
- CSS3

**Original Algorithm:**
- C++ (reference implementation)

## Performance Tips

- **Start with Simple Puzzles**: Test with puzzles that have more given numbers
- **Use MRV Heuristic**: Typically 10-100× faster than basic backtracking
- **Check Browser Console**: Look for error messages if something fails

## License

Educational project - Free to use and modify

---

**Enjoy Solving Sudoku!**
