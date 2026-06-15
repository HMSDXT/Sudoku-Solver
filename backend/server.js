import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import SudokuSolver from './sudokuSolver.js';

const app=express();
const PORT=process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/generate/:difficulty',(req,res)=>{
  try{
    const {difficulty}=req.params;
    const validDifficulties=['easy','medium','hard'];
    if(!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        error:'Invalid difficulty',supported:validDifficulties
      });
    }
    const puzzle=SudokuSolver.generatePuzzle(difficulty);
    res.json({
      success:true,
      difficulty,
      board:puzzle
    });

  }catch (error){
    console.error('Puzzle Generation Error:',error);
    res.status(500).json({
      success:false,
      error:'Failed to generate puzzle',
      message:error.message
    });
  }
});

app.post('/api/solve',(req,res)=>{
  try{
    const {board,algorithm='basic'}=req.body;
    if(!board || !Array.isArray(board) || board.length!==9 || !board.every(
        row=>Array.isArray(row) && row.length===9
    ))
    {
      return res.status(400).json({
        error:'Board must be a 9x9 array'
      });
    }

    const validAlgorithms=['basic','mrv'];
    if(!validAlgorithms.includes(algorithm)){
      return res.status(400).json({
        error:'Invalid algorithm',
        supported:validAlgorithms
      });
    }

    const numBoard=board.map(row=>
      row.map(cell=>{
        if(cell==='' || cell===null || cell===undefined)
          return 0;
        const value=parseInt(cell,10);
        return Number.isNaN(value) ? 0 : value;
      })
    );

    const solver=new SudokuSolver(numBoard);

    if(!solver.validatePuzzle()){
      return res.status(400).json({
        error:'Invalid Sudoku puzzle'
      });
    }

    const result=solver.solve(algorithm);

    res.json({
      success:true,
      ...result
    });
  }catch (error){
    console.error('Sudoku Solve Error:',error);
    res.status(500).json({
      success:false,
      error:'Failed to solve Sudoku',
      message:error.message
    });
  }
});

app.post('/api/compare',(req,res)=>{
  try{
    const {board}=req.body;
    if(!board || !Array.isArray(board) || board.length!==9){
      return res.status(400).json({
        error:'Invalid board format'
      });
    }
    const numBoard=board.map(row=>
      row.map(cell=>
        cell==='' ? 0 : parseInt(cell,10) || 0
      )
    );

    const solver=new SudokuSolver(numBoard);

    const comparison=solver.compareAlgorithms();

    res.json({
      success:true,
      comparison
    });

  }catch (error){
    console.error('Comparison Error:',error);
    res.status(500).json({
      success:false,
      error:'Failed to compare algorithms',
      message:error.message
    });
  }
});

app.get('/api/health',(req,res)=>{
  res.json({
    status:'running',
    service:'Sudoku Solver API'
  });
});

app.listen(PORT,()=>{
  console.log(`Sudoku Solver Backend running on port ${PORT}`);
  console.log(`Health: /api/health`);
  console.log(`Solve: POST /api/solve`);
  console.log(`Generate: GET /api/generate/:difficulty`);
  console.log(`Compare: POST /api/compare`);
  console.log(`Analyze: POST /api/analyze`);
});