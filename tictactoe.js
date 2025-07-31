
class TicTacToe {
  constructor(board = Array(9).fill(null), currentPlayer = 'X') {
    this.board = board;
    this.currentPlayer = currentPlayer;
  }

  clone() {
    return new TicTacToe([...this.board], this.currentPlayer);
  }

  getMoves() {
    if (this.getWinner()) return [];
    return this.board.map((val, idx) => val === null ? idx : null).filter(x => x !== null);
  }

  performMove(move) {
    if (this.board[move] !== null) return;
    this.board[move] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  isGameOver() {
    return this.getWinner() !== null || this.getMoves().length === 0;
  }

  getResult(player) {
    const winner = this.getWinner();
    if (winner === player) return 1;
    if (winner === null) return 0.5;
    return 0;
  }

  getWinner() {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of wins) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    return null;
  }

  toString() {
    return this.board.map(c => c || '.').join('');
  }
}
