
let game = new TicTacToe();
let rootElement = document.getElementById('game');

function render() {
  rootElement.innerHTML = '';
  game.board.forEach((val, idx) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = val || '';
    cell.onclick = () => {
      if (!val && !game.isGameOver()) {
        game.performMove(idx);
        render();
        setTimeout(aiMove, 200);
      }
    };
    rootElement.appendChild(cell);
  });
  updateEvaluation();
}

function aiMove() {
  const tree = new MCTS(game);
  tree.run(1000);
  const best = tree.bestMove();
  if (best !== null) {
    game.performMove(best);
    render();
  }
}

function updateEvaluation() {
  const tree = new MCTS(game);
  tree.run(500);

  const children = tree.root.children;
  if (!children || children.length === 0) {
    document.getElementById('bar-inner').style.width = `50%`;
    document.getElementById('eval-text').textContent = `Evaluation: 50%`;
    return;
  }

  const values = children.map(c => c.wins / c.visits);
  const maxValue = Math.max(...values);

  document.getElementById('bar-inner').style.width = `${maxValue * 100}%`;
  document.getElementById('eval-text').textContent = `Evaluation: ${(maxValue * 100).toFixed(1)}%`;
}

render();
