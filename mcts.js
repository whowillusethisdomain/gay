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
      const exploitation = child.visits === 0 ? 0 : (child.wins / child.visits);
      const exploration = child.visits === 0 ? Infinity : c * Math.sqrt(Math.log(this.visits + 1) / child.visits);
      const uctValue = exploitation + exploration;
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
      this.runIteration();
    }
  }

  runIteration() {
    let node = this.root;

    // Selection
    while (!node.game.isGameOver() && node.isFullyExpanded()) {
      node = node.bestChild();
    }

    // Expansion
    if (!node.game.isGameOver() && node.untriedMoves.length > 0) {
      node = node.expand();
    }

    // Simulation
    let tempGame = node.game.clone();
    while (!tempGame.isGameOver()) {
      const moves = tempGame.getMoves();
      const move = this.lightHeuristicPolicy(tempGame, moves);
      tempGame.performMove(move);
    }

    // Backpropagation
    const result = tempGame.getResult(node.player); // result: 1 = win, 0.5 = draw, 0 = lose
    while (node !== null) {
      node.update(result);
      node = node.parent;
    }
  }

  lightHeuristicPolicy(game, moves) {
    // 기본은 랜덤
    // 여기에 더 나은 평가 기준을 넣을 수 있음 (예: 중앙 선호, 승리 수 계산 등)
    return moves[Math.floor(Math.random() * moves.length)];
  }

  bestMove() {
    return this.root.mostVisitedChild()?.move || null;
  }

  updateRootWithMove(move) {
    const child = this.root.children.find(c => JSON.stringify(c.move) === JSON.stringify(move));
    if (child) {
      this.root = child;
      this.root.parent = null;
    } else {
      this.root = new Node(this.root.game, move);
    }
  }

  runForTime(ms = 100) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      this.runIteration();
    }
  }
}
