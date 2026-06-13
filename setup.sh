#!/bin/bash

echo "Setting up Sudoku Solver Full Stack Application"
echo "=================================================="
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "Frontend dependencies installed"
echo ""

echo "=================================================="
echo "Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Open two terminal tabs/windows"
echo ""
echo "2. In the first terminal, start the backend:"
echo "   cd backend && npm start"
echo ""
echo "3. In the second terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser to: http://localhost:5173"
echo ""
echo "=================================================="
