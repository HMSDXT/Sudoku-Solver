# Quick Start Guide

## Project Status: COMPLETE & TESTED

Sudoku Solver is fully built and working!

---

## To Run the Project (Next Time)

### Terminal 1 - Backend Server:
```bash
cd backend
npm start
```
Server runs on **http://localhost:5001**

### Terminal 2 - Frontend Dev Server:
```bash
cd frontend
npm run dev
```
App runs on **http://localhost:5174**

### Open Browser:
```
http://localhost:5174
```

---

## Using the App

1. **Enter numbers** 1-9 in the grid cells
2. **Select algorithm**: Basic Backtracking or MRV Heuristic
3. **Click "Solve"** - backend solves in milliseconds
4. **View metrics** - nodes visited, backtracks, time taken
5. **Click "Reset"** to try another puzzle

---

## Performance Tips

| Algorithm | Speed | Best For |
|-----------|-------|----------|
| **Basic Backtracking** | Slower | Learning |
| **MRV Heuristic** | 10-100× faster | Most Puzzles |

→ **Use MRV for best performance!**

---

## API (If Building Something Else)

**Solve Puzzle:**
```
POST http://localhost:5001/api/solve
Content-Type: application/json

{
  "board": [[5,3,0,...], ...],
  "algorithm": "basic" or "mrv"
}
```

**Health Check:**
```
GET http://localhost:5001/api/health
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to backend" | Run `npm start` in backend folder |
| Port 5001 in use | Kill: `sudo lsof -i :5001 -t \| xargs kill -9` |
| Slow solving | Switch to MRV Heuristic algorithm |
| Cache issues | Clear browser cache & refresh |

---

## File Locations

```
Project Root: /Users/hmsdxt/Downloads/DSA Project/

Backend:
  - server.js (port 5001)
  - sudokuSolver.js (algorithms)
  - node_modules/ (dependencies)

Frontend:
  - src/App.jsx (main component)
  - src/App.css (styling)
  - node_modules/ (dependencies)
```

---

## What's Included

Full-stack web application  
Two solving algorithms (Backtracking + MRV)  
Real-time performance metrics  
Modern React UI with Vite  
Express REST API  
CORS enabled  
Error handling  
Complete documentation  

---

## Technologies

- Backend: Node.js, Express.js
- Frontend: React 19, Vite
- HTTP Client: Axios
- Style: Modern CSS3

---

**Happy Solving!**
