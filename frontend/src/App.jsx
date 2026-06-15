import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {useState} from 'react';
import axios from 'axios';
import './App.css';

const API_URL=import.meta.env.VITE_API_URL || 'http://localhost:5001';

function App(){

  const emptyBoard=Array(9).fill().map(()=>Array(9).fill(''));
  const [board,setBoard]=useState(emptyBoard);
  const [algorithm,setAlgorithm]=useState('basic');
  const [difficulty,setDifficulty]=useState('Easy');
  const [solving,setSolving]=useState(false);
  const [error,setError]=useState('');
  const [stats,setStats]=useState({nodesVisited:0,backtracks:0,timeMs:0});
  const [comparison,setComparison]=useState(null);
  const [animatingCells,setAnimatingCells]=useState(new Set());
  const [selectedCell,setSelectedCell]=useState(null);
  const [possibleInputs,setPossibleInputs]=useState([]);
  
  const getPossibleInputs=(row,col)=>{
    const used=new Set();
    for(let c=0;c<9;c++){
      if(c!==col && board[row][c]!==''){
        used.add(Number(board[row][c]));
      }
    }
    for(let r=0;r<9;r++){
      if(r!==row && board[r][col]!==''){
        used.add(Number(board[r][col]));
      }
    }
    const startRow=Math.floor(row/3)*3;
    const startCol=Math.floor(col/3)*3;
    for(let r=startRow;r<startRow+3;r++){
      for(let c=startCol;c<startCol+3;c++){
        if(!(r===row && c===col) && board[r][c]!==''){
          used.add(Number(board[r][c]));
        }
      }
    }
    const candidates=[];
    for (let num=1;num<=9;num++){
      if(!used.has(num)){
        candidates.push(num);
      }
    }
    return candidates;
  };
  const handleCellClick=(row,col)=>{setSelectedCell({row,col}); setPossibleInputs(getPossibleInputs(row,col));};

  const handleChange=(row,col,value)=>{
    if(value!=='' && !/^[1-9]$/.test(value)) return;
    const newBoard=board.map(r=>[...r]);
    newBoard[row][col]=value;
    setBoard(newBoard);
    setError('');
    if(selectedCell && selectedCell.row===row && selectedCell.col===col){
      setTimeout(()=>{
        setPossibleInputs(getPossibleInputs(row,col));
      },0);
    }
  };

  const generatePuzzle=async ()=>{
    try{
      setError('');
      const response=await axios.get(`${API_URL}/api/generate/${difficulty.toLowerCase()}`);
      const puzzleBoard=response.data.board.map(row=>row.map(cell=>cell===0 ? '' : cell.toString()));
      setBoard(puzzleBoard);
      setStats({nodesVisited: 0,backtracks: 0,timeMs: 0});
      setAnalysis(null);
      setComparison(null);
    }catch (err){
      console.error(err);
      setError(
        'Failed to generate puzzle.'
      );
    }
  };

  const solveSudoku=async ()=>{
    try{
      setError('');
      setSolving(true);
      const originalBoard=board.map(r=>[...r]);
      const response=await axios.post(`${API_URL}/api/solve`,{board,algorithm});
      if(!response.data.solved){
        setError('No solution exists.');
        setSolving(false);
        return;
      }
      const solvedBoard=response.data.board;
      const positions=[];
      for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
          if(originalBoard[i][j]===''){positions.push({row: i,col: j});}
        }
      }
      setAnimatingCells(new Set());
      let delay=0;
      positions.forEach(
        ({row,col})=>{
          setTimeout(()=>{
            setBoard(prev=>{const updated=prev.map(r=>[...r]);
              updated[row][col]=solvedBoard[row][col].toString();
              return updated;
            });
            setAnimatingCells(prev=>{
              const updated=new Set(prev);
              updated.add(`${row}-${col}`);
              return updated;
            });
          },delay);
          delay+=30;
        }
      );
      setTimeout(()=>{
        setAnimatingCells(new Set());
        setStats(response.data.stats);
        setSolving(false);
      },delay+200);
    }catch (err){
      console.error(err);
      setError('Failed to solve puzzle.');
      setSolving(false);
    }
  };

  const compareAlgorithms=async ()=>{
    try{
      const response=await axios.post(`${API_URL}/api/compare`,{board});
      setComparison(response.data.comparison);
    }catch (err){
      console.error(err);
      setError('Failed to compare algorithms.');
    }
  };

  const resetBoard=()=>{
    setBoard(emptyBoard);
    setStats({nodesVisited:0,backtracks:0,timeMs:0});
    setComparison(null);
    setError('');
  };
  return(
    <div className="container">
      <div className="controls">
        <select value={algorithm} onChange={e=>setAlgorithm(e.target.value)}>
          <option value="basic">Backtracking</option>
          <option value="mrv">MRV Heuristic</option>
        </select>
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <div className="main-layout">
        <div className="left-panel">
          <div className="sudoku-grid">
            {Array(9).fill().map((_, blockIndex)=>{
              const blockRow=Math.floor(blockIndex/3)*3;
              const blockCol=(blockIndex%3)*3;
              return(
                <div key={blockIndex} className="sudoku-block">
                  {Array(9).fill().map((_, cellIndex)=>{
                    const row=blockRow+Math.floor(cellIndex/3);
                    const col=blockCol+(cellIndex%3);
                    const animated=animatingCells.has(`${row}-${col}`);
                    return(
                      <input key={`${row}-${col}`} type="text" maxLength="1" value={board[row][col]}
                        onChange={e=>handleChange(row,col,e.target.value)}
                        onClick={()=>handleCellClick(row,col)}
                        className={`${animated?'animating':''}${
                          selectedCell && selectedCell.row===row && selectedCell.col===col ? 'selected-cell':''}`}/>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="buttons">
                <button onClick={generatePuzzle}>Generate</button>
                <button onClick={solveSudoku} disabled={solving}>
                  {solving ? 'Solving...' : 'Solve'}
                </button>
                <button onClick={compareAlgorithms}>Compare</button>
                <button onClick={resetBoard}>Reset</button>
              </div>
        </div>
        <div className="right-panel">
            {selectedCell && (<div className="stats">
              <h2>Possible Inputs</h2>
              <p>Selected Cell:<span>({selectedCell.row+1},{selectedCell.col+1})</span></p>
              <div className="candidates">
                {possibleInputs.map(num=>(
                  <button key={num} className="candidate-btn"
                    onClick={()=>handleChange(selectedCell.row,selectedCell.col,num.toString())}>                  {num}
                  </button>
                  ))}
                </div>
              </div>
              )}
              {error && (<div className="error">{error}</div>)}
              <div className="stats">
                <h2>Performance Metrics</h2>
                <p>Nodes Visited: <span>{stats.nodesVisited}</span></p>
                <p>Backtracks: <span>{stats.backtracks}</span></p>
                <p>Time: <span>{stats.timeMs}</span> ms</p>
              </div>
              {comparison && (
                <div className="stats">
                  <h2>Algorithm Comparison</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Basic</th>
                        <th>MRV</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Nodes</td>
                        <td>{comparison.basic.nodesVisited}</td>
                        <td>{comparison.mrv.nodesVisited}</td>
                      </tr>
                      <tr>
                        <td>Backtracks</td>
                        <td>{comparison.basic.backtracks}</td>
                        <td>{comparison.mrv.backtracks}</td>
                      </tr>
                      <tr>
                        <td>Time(ms)</td>
                        <td>{comparison.basic.timeMs}</td>
                        <td>{comparison.mrv.timeMs}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
createRoot(
  document.getElementById('root')
).render(
  <StrictMode>
    <App />
  </StrictMode>
);
export default App;
