#include <iostream>
#include <chrono>
#include <iomanip>
#include <vector>
#include <algorithm>
#include <random>
#include <ctime>

using namespace std;
using namespace chrono;

class Stats {
public:
    long long nodesVisited = 0;
    long long backtracks = 0;
};

class Sudoku {

    int board[9][9];

    public:

        Sudoku() {
            int sampl[9][9]={
                {5,3,0,0,7,0,0,0,0},
                {6,0,0,1,9,5,0,0,0},
                {0,9,8,0,0,0,0,6,0},
                {8,0,0,0,6,0,0,0,3},
                {4,0,0,8,0,3,0,0,1},
                {7,0,0,0,2,0,0,0,6},
                {0,6,0,0,0,0,2,8,0},
                {0,0,0,4,1,9,0,0,5},
                {0,0,0,0,8,0,0,7,9}
            };
            loadBoard(sampl);
            srand(time(nullptr));
        }

        void clearBoard(){
            for(int i=0;i<9;i++)
                for(int j=0;j<9;j++)
                    board[i][j]=0;
        }

        void loadBoard(int src[9][9]){
            for(int i=0;i<9;i++)
                for(int j=0;j<9;j++)
                    board[i][j]=src[i][j];
        }

        void copyBoard(int dest[9][9]) {
            for(int i=0;i<9;i++)
                for(int j=0;j<9;j++)
                    dest[i][j]=board[i][j];
        }

        void printBoard() {
            cout<<"\n";
            for(int i=0;i<9;i++){
                if(i%3==0)
                    cout<<"-------------------------\n";
                for(int j=0;j<9;j++){
                    if(j%3==0) cout<<"| ";
                    if(board[i][j]==0) cout<<"  ";
                    else cout<<board[i][j]<<" ";
                }
                cout<<"|\n";
            }
            cout<<"-------------------------\n";
        }

        bool validatePuzzle(){
            for(int row=0;row<9;row++){
                bool seen[10]={false};
                for(int col=0;col<9;col++){
                    int num=board[row][col];
                    if(num==0) continue;
                    if(seen[num]) return false;
                    seen[num]=true;
                }
            }
            for(int col=0;col<9;col++){
                bool seen[10]={false};
                for(int row=0;row<9;row++){
                    int num=board[row][col];
                    if(num==0) continue;
                    if(seen[num]) return false;
                    seen[num]=true;
                }
            }
            for(int sr=0;sr<9;sr+=3){
                for(int sc=0;sc<9;sc+=3){
                    bool seen[10]={false};
                    for(int i=0;i<3;i++){
                        for(int j=0;j<3;j++){
                            int num=board[sr+i][sc+j];
                            if(num==0) continue;
                            if(seen[num]) return false;
                            seen[num]=true;
                        }
                    }
                }
            }
            return true;
        }

        bool isSafe(int row,int col,int num){
            for(int x=0;x<9;x++){
                if(board[row][x]==num) return false;
            }
            for(int x=0;x<9;x++){
                if(board[x][col]==num) return false;
            }
            int startRow=row-row%3;
            int startCol=col-col%3;
            for(int i=0;i<3;i++){
                for(int j=0;j<3;j++){
                    if(board[startRow+i][startCol+j]==num) return false;
                }
            }
            return true;
        }

        bool findEmptyCell(int &row,int &col){
            for(row=0;row<9;row++){
                for(col=0;col<9;col++){
                    if(board[row][col]==0) return true;
                }
            }
            return false;
        }

        int countCandidates(int row,int col){
            int count=0;
            for(int num=1;num<=9;num++){
                if(isSafe(row,col,num)) count++;
            }
            return count;
        }

        bool findMRVCell(int &bestRow,int &bestCol){
            int minChoices=10;
            bool found=false;
            for(int row=0;row<9;row++){
                for(int col=0;col<9;col++){
                    if(board[row][col]==0){
                        int choices=countCandidates(row,col);
                        if(choices<minChoices){
                            minChoices=choices;
                            bestRow=row;
                            bestCol=col;
                            found=true;
                        }
                    }
                }
            }
            return found;
        }

        bool solveBacktracking(Stats &s){
            s.nodesVisited++;
            int row,col;
            if(!findEmptyCell(row,col)) return true;
            for(int num=1;num<=9;num++){
                if(isSafe(row,col,num)){
                    board[row][col]=num;
                    if(solveBacktracking(s)) return true;
                    board[row][col]=0;
                    s.backtracks++;
                }
            }
            return false;
        }

        bool solveMRV(Stats &s){
            s.nodesVisited++;
            int row,col;
            if(!findMRVCell(row,col)) return true;
            for(int num=1;num<=9;num++){
                if(isSafe(row,col,num)){
                    board[row][col]=num;
                    if(solveMRV(s)) return true;
                    board[row][col]=0;
                    s.backtracks++;
                }
            }
            return false;
        }

        bool fillBoardRandom(){
            int row,col;
            if(!findEmptyCell(row,col)) return true;
            vector<int> nums={1,2,3,4,5,6,7,8,9};
            random_device rd;
            mt19937 g(rd());
            shuffle(nums.begin(),nums.end(),g);
            for(int num:nums){
                if(isSafe(row,col,num)){
                    board[row][col]=num;
                    if(fillBoardRandom()) return true;
                    board[row][col]=0;
                }
            }
            return false;
        }

        void generatePuzzle(int emptyCells) {
            clearBoard();
            fillBoardRandom();
            int removed=0;
            while(removed<emptyCells){
                int row=rand()%9;
                int col=rand()%9;
                if(board[row][col]!=0){
                    board[row][col]=0;
                    removed++;
                }
            }
        }

        int countEmptyCells(){
            int count=0;
            for(int i=0;i<9;i++)
                for(int j=0;j<9;j++)
                    if(board[i][j]==0) count++;
            return count;
        }

        void analyzeDifficulty(){
            int emptyCells=countEmptyCells();
            cout<<"\nDifficulty Analysis\n";
            cout<<"--------------------\n";
            cout<<"Empty Cells: "<<emptyCells<<"\n";
            if(emptyCells<35) cout<<"Difficulty: EASY\n";
            else if(emptyCells<50) cout<<"Difficulty: MEDIUM\n";
            else cout<<"Difficulty: HARD\n";
        }

        void compareAlgorithms(){
            int backup[9][9];
            copyBoard(backup);
            Stats btStats;
            auto start1=high_resolution_clock::now();
            solveBacktracking(btStats);
            auto end1=high_resolution_clock::now();
            double btTime=duration<double,milli>(end1-start1).count();
            loadBoard(backup);
            Stats mrvStats;
            auto start2=high_resolution_clock::now();
            solveMRV(mrvStats);
            auto end2=high_resolution_clock::now();
            double mrvTime=duration<double,milli>(end2-start2).count();
            loadBoard(backup);
            cout<<"\nAlgorithm Comparison\n";
            cout<<"---------------------------------------\n";
            cout<<left<<setw(18)<<"Metric"<<setw(15)<<"Backtracking"<<setw(15)<<"MRV"<<"\n";
            cout<<"---------------------------------------\n";
            cout<<setw(18)<<"Time(ms)"<<setw(15)<<btTime<<setw(15)<<mrvTime<<"\n";
            cout<<setw(18)<<"Nodes"<<setw(15)<<btStats.nodesVisited<<setw(15)<<mrvStats.nodesVisited<<"\n";
            cout<<setw(18)<<"Backtracks"<<setw(15)<<btStats.backtracks<<setw(15)<<mrvStats.backtracks<<"\n";
        }
};

int main() {

    Sudoku sudoku;
    int choice;

    do{
        cout<<"\n=====================================\n";
        cout<<"           SUDOKU SOLVER\n";
        cout<<"=====================================\n";
        cout<<"1. Display Puzzle\n";
        cout<<"2. Validate Puzzle\n";
        cout<<"3. Solve Using Backtracking\n";
        cout<<"4. Solve Using MRV\n";
        cout<<"5. Compare Algorithms\n";
        cout<<"6. Analyze Difficulty\n";
        cout<<"7. Generate Easy Puzzle\n";
        cout<<"8. Generate Medium Puzzle\n";
        cout<<"9. Generate Hard Puzzle\n";
        cout<<"10. Exit\n";
        cout<<"\nEnter choice: ";
        if(!(cin>>choice)){
            cout<<"\nInvalid input! Enter a number.\n";
            cin.clear();
            cin.ignore(10000,'\n');
            continue;
        }
        switch(choice){
        case 1:
            sudoku.printBoard();
            break;
        case 2:
            if(sudoku.validatePuzzle()) cout<<"\nPuzzle is VALID.\n";
            else cout<<"\nPuzzle is INVALID.\n";
            break;
        case 3:{
            Stats stats;
            auto start=high_resolution_clock::now();
            bool solved=sudoku.solveBacktracking(stats);
            auto end=high_resolution_clock::now();
            double timeTaken=duration<double, milli>(end-start).count();
            if(solved){
                cout<<"\nSolved using Backtracking\n";
                sudoku.printBoard();
                cout<<"\nExecution Time : "<<fixed<<setprecision(3)<<timeTaken<< " ms\n";
                cout<<"Nodes Visited : "<<stats.nodesVisited<<"\n";
                cout<<"Backtracks : "<<stats.backtracks<<"\n";
            }
            else cout<<"\nNo solution exists.\n";
            break;
        }
        case 4:{
            Stats stats;
            auto start=high_resolution_clock::now();
            bool solved=sudoku.solveMRV(stats);
            auto end=high_resolution_clock::now();
            double timeTaken=duration<double, milli>(end-start).count();
            if(solved){
                cout<<"\nSolved using MRV\n";
                sudoku.printBoard();
                cout<<"\nExecution Time : "<<fixed<<setprecision(3)<<timeTaken<<" ms\n";
                cout<<"Nodes Visited : "<<stats.nodesVisited<<"\n";
                cout<<"Backtracks : "<<stats.backtracks<<"\n";
            }
            else cout<<"\nNo solution exists.\n";
            break;
        }
        case 5:
            sudoku.compareAlgorithms();
            break;
        case 6:
            sudoku.analyzeDifficulty();
            break;
        case 7:
            sudoku.generatePuzzle(35);
            cout<<"\nEasy Puzzle Generated\n";
            sudoku.printBoard();
            break;
        case 8:
            sudoku.generatePuzzle(45);
            cout<<"\nMedium Puzzle Generated\n";
            sudoku.printBoard();
            break;
        case 9:
            sudoku.generatePuzzle(55);
            cout<<"\nHard Puzzle Generated\n";
            sudoku.printBoard();
            break;
        case 10:
            cout<<"\nThank you!\n";
            break;
        default:
            cout<<"\nInvalid choice.\n";
        }
    }while(choice!=10);
    return 0;
}