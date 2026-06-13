import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import SudokuSolver from './sudokuSolver.js';

const app=express();
const PORT = 5001;
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ message: "API running" });
});

module.exports = app;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.get('/api/generate/:difficulty',(req,res)=>{
  const {difficulty}=req.params;
  const puzzle=SudokuSolver.generatePuzzle(difficulty);
  res.json({board:puzzle,difficulty});
});

// Routes
app.post('/api/solve',(req,res)=>{
  try{
    const {board,algorithm}=req.body;

    // Validate board
    if(!board || !Array.isArray(board) || board.length!==9){
      return res.status(400).json({ error:'Invalid board format'});
    }

    // Validate algorithm
    if(!['basic','mrv'].includes(algorithm)){
      return res.status(400).json({error:'Invalid algorithm. Use "basic" or "mrv"'});
    }

    // Convert board to numbers
    const numBoard=board.map(row=>
      row.map(cell=>(cell===''?0:parseInt(cell) || 0))
    );

    // Solve
    const solver=new SudokuSolver(numBoard);
    const result=solver.solve(algorithm);
    res.json(result);
  }catch (error){
    console.error('Error solving Sudoku:',error);
    res.status(500).json({ error:'Failed to solve Sudoku',message:error.message});
  }
});

app.get('/api/health', (req, res)=>{
  res.json({status:'Backend is running'});
});

// Start server
app.listen(PORT,()=>{
  console.log(`Sudoku Solver Backend running on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/solve to solve a sudoku`);
});
