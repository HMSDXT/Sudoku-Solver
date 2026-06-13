#include <iostream>
#include <chrono>

using namespace std;
using namespace chrono;

class Stats{
    public:
    long long nodesVisited=0;
    long long backtracks=0;
};

int board1[9][9]={
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

int board2[9][9];

void copyBoard(){
    for(int i=0;i<9;i++){
        for(int j=0;j<9;j++){
            board2[i][j]=board1[i][j];
        }
    }
}

void printBoard(){
    cout<<"\n";
    for(int i=0;i<9;i++){
        if(i%3==0 && i!=0){
            cout<<"-------------------------\n";
        }
        for(int j=0;j<9;j++){
            if(j%3==0) cout<<"| ";
            cout<<board2[i][j]<<" ";
        }
        cout<<"|\n";
    }
}

bool findEmptyCell(int &row,int &col){
    for(row=0;row<9;row++){
        for(col=0;col<9;col++){
            if(board2[row][col]==0) return true;
        }
    }
    return false;
}

bool isRowSafe(int row,int num){
    for(int col=0;col<9;col++){
        if(board2[row][col]==num) return false;
    }
    return true;
}

bool isColSafe(int col,int num){
    for(int row=0;row<9;row++){
        if(board2[row][col]==num) return false;
    }
    return true;
}

bool isBoxSafe(int startRow,int startCol,int num){
    for(int i=0;i<3;i++){
        for(int j=0;j<3;j++){
            if(board2[startRow+i][startCol+j]==num) return false;
        }
    }
    return true;
}

bool isSafe(int row,int col,int num){
    return(isRowSafe(row,num) && isColSafe(col,num) && isBoxSafe(row-row%3,col-col%3,num));
}

int countCandidates(int row,int col){
    int count=0;
    for(int num=1;num<=9;num++){
        if(isSafe(row,col,num)) count++;
    }
    return count;
}

bool findMRVCell(int &oRow,int &oCol){
    int minChoices=10;
    bool found=false;
    for(int row=0;row<9;row++){
        for(int col=0;col<9;col++){
            if(board2[row][col]==0){
                int choices=countCandidates(row,col);
                if(choices<minChoices){
                    minChoices=choices;
                    oRow=row;
                    oCol=col;
                    found=true;
                }
            }
        }
    }
    return found;
}

bool solveSudoku(Stats &s){
    s.nodesVisited++;
    int row,col;
    if(!findEmptyCell(row,col)) return true;
    for(int num=1;num<=9;num++){
        if(isSafe(row,col,num)){
            board2[row][col]=num;
            if(solveSudoku(s)) return true;
            board2[row][col]=0;
            s.backtracks++;
        }
    }
    return false;
}

bool solveMRVSudoku(Stats &s){
    s.nodesVisited++;
    int row,col;
    if(!findMRVCell(row,col)) return true;
    for(int num=1;num<=9;num++){
        if(isSafe(row,col,num)){
            board2[row][col]=num;
            if(solveMRVSudoku(s)) return true;
            board2[row][col]=0;
            s.backtracks++;
        }
    }
    return false;
}
