
// Minimal MCTS implementation compatible with this project.
// Full version should be replaced with real mcts.js from the GitHub repo.

class Node {
  constructor(game, move = null, parent = null) {
    this.game = game.clone();
    if (move !== null) this.game.performMove(move);
    this.parent = parent;
    this.move = move;
    this.children = [];
    this.visits = 0;
    this.wins = 0;
    this.untriedMoves = this.game.getMoves();
    this.player = this.game.currentPlayer;
  }

  isFullyExpanded() {
    return this.untriedMoves.length === 0;
  }

  bestChild(c = Math.sqrt(2)) {
    return this.children.reduce((best, child) => {
      const uctValue = (child.wins / child.visits) + c * Math.sqrt(Math.log(this.visits) / child.visits);
      return uctValue > best.uct ? { node: child, uct: uctValue } : best;
    }, { node: null, uct: -Infinity }).node;
  }

  expand() {
    const move = this.untriedMoves.pop();
    const child = new Node(this.game, move, this);
    this.children.push(child);
    return child;
  }

  update(result) {
    this.visits++;
    this.wins += result;
  }

  mostVisitedChild() {
    return this.children.reduce((a, b) => (a.visits > b.visits ? a : b));
  }
}

class MCTS {
  constructor(rootGame) {
    this.root = new Node(rootGame);
  }

  run(iterations = 1000) {
    for (let i = 0; i < iterations; i++) {
      let node = this.root;
      while (!node.game.isGameOver() && node.isFullyExpanded()) {
        node = node.bestChild();
      }
      if (!node.game.isGameOver()) {
        node = node.expand();
      }
      let tempGame = node.game.clone();
      while (!tempGame.isGameOver()) {
        const moves = tempGame.getMoves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        tempGame.performMove(move);
      }
      const result = tempGame.getResult(node.player);
      while (node !== null) {
        node.update(result);
        node = node.parent;
      }
    }
  }

  bestMove() {
    return this.root.mostVisitedChild()?.move || null;
  }
}
