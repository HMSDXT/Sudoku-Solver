import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [board,setBoard]=useState(Array(9).fill().map(()=>Array(9).fill("")));
  const [algorithm,setAlgorithm]=useState("basic");
  const [difficulty,setDifficulty]=useState("Easy");
  const [solving,setSolving]=useState(false);
  const [stats,setStats]=useState({nodesVisited:0,backtracks:0,timeMs:0});
  const [error,setError]=useState("");
  const [animatingCells,setAnimatingCells]=useState(new Set());

  const handleChange=(row,col,value)=>{
    if(value !=="" && (value<1 || value>9)) return;
    const newBoard=board.map((r)=>[...r]);
    newBoard[row][col]=value;
    setBoard(newBoard);
    setError("");
  };

  const generatePuzzle=async()=>{
    try{
      setError("");
      const response=await axios.get(`http://localhost:5001/api/generate/${difficulty}`);
      const puzzleBoard=response.data.board.map(row=>row.map(cell=>cell===0?"":cell.toString()));
      setBoard(puzzleBoard);
      setStats({nodesVisited:0,backtracks:0,timeMs:0});
    }catch(err){
      setError("Error generating puzzle. Make sure the server is running on port 5001.");
      console.error(err);
    }
  };

  const solveSudoku=async()=>{
    try{
      setError("");
      setSolving(true);
      setAnimatingCells(new Set());
      const response=await axios.post("http://localhost:5001/api/solve",{
        board:board,
        algorithm:algorithm
      });
      if(response.data.solved){
        const newBoard=response.data.board;
        const emptyPositions=[];
        for(let i=0;i<9;i++){
          for(let j=0;j<9;j++){
            if(board[i][j]==="") emptyPositions.push({row:i,col:j});
          }
        }
        const stats=response.data.stats;
        const efficiencyRatio=stats.backtracks/(stats.nodesVisited||1);
        const baseDelay=Math.max(50,Math.min(400,50+efficiencyRatio*500));
        const animationDelay=Math.max(50,Math.min(300,baseDelay*10000/emptyPositions.length/100));
        let delay=0;
        emptyPositions.forEach(({row,col})=>{
          setTimeout(()=>{
            setBoard(prev=>{
              const updated=prev.map((r)=>[...r]);
              updated[row][col]=newBoard[row][col];
              return updated;
            });
            setAnimatingCells(prev=>{
              const updated=new Set(prev);
              updated.add(`${row}-${col}`);
              return updated;
            });
          },delay);
          delay+=animationDelay;
        });
        setTimeout(()=>{
          setStats(stats);
          setAnimatingCells(new Set());
          setSolving(false);
        },delay+200);
      }else{
        setError("No solution exists for this Sudoku!");
        setSolving(false);
      }
    }catch(err){
      setError("Error connecting to backend. Make sure the server is running on port 5001.");
      console.error(err);
      setSolving(false);
    }
  };

  const resetBoard=()=>{
    setBoard(Array(9).fill().map(()=>Array(9).fill("")));
    setStats({nodesVisited:0,backtracks:0,timeMs:0});
    setError("");
    setAnimatingCells(new Set());
  };
  return(
    <div className="container">
      <div className="controls">
        <select value={algorithm} onChange={(e)=>setAlgorithm(e.target.value)}>
          <option value="basic">Basic Backtracking</option>
          <option value="mrv">MRV Heuristic</option>
        </select>
        <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="sudoku-grid">
        {Array(9).fill().map((_, blockIndex) => {
          const blockRow = Math.floor(blockIndex / 3) * 3;
          const blockCol = (blockIndex % 3) * 3;
          return (
            <div key={`block-${blockIndex}`} className="sudoku-block">
              {Array(9).fill().map((_, cellIndex) => {
                const row = blockRow + Math.floor(cellIndex / 3);
                const col = blockCol + (cellIndex % 3);
                const isAnimating=animatingCells.has(`${row}-${col}`);
                return (
                  <input 
                    key={`${row}-${col}`} 
                    type="number" 
                    min="1" 
                    max="9" 
                    value={board[row][col]} 
                    onChange={(e)=>handleChange(row, col, e.target.value)}
                    className={isAnimating?"animating":""}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="buttons">
        <button onClick={generatePuzzle}>Generate</button>
        <button onClick={solveSudoku} disabled={solving}>
          {solving ? "Solving..." : "Solve"}</button>
        <button onClick={resetBoard} disabled={solving}>Reset</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="stats">
        <h2>Performance Metrics</h2>
        <p>Difficulty: <span>{difficulty}</span></p>
        <p>Nodes Visited: <span>{stats.nodesVisited}</span></p>
        <p>Backtracks: <span>{stats.backtracks}</span></p>
        <p>Time: <span>{stats.timeMs}</span> ms</p>
      </div>
    </div>
  );
}

export default App;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
