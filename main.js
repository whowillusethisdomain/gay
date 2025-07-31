import { Game } from './mcts/game.js';
import { MCTS } from './mcts/mcts.js';
import { drawStats, drawBoard, getClickedCell } from './mcts/viz.js';

const canvas = document.getElementById('board');
const statsDiv = document.getElementById('stats');

let game = new Game();
let mcts = new MCTS(game);

function update() {
  drawBoard(game.state, canvas);
  mcts = new MCTS(game);
  mcts.run(10000); // ← 여기서 탐색 수를 설정
  const stats = mcts.root.children.map(c => ({
    move: c.move,
    visits: c.visits,
    winRate: c.visits ? (c.wins / c.visits) : 0
  }));
  drawStats(stats, statsDiv);
}

canvas.addEventListener('click', e => {
  const idx = getClickedCell(e, canvas);
  if (game.performMove(idx)) {
    update();
  }
});

update();
