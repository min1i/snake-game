const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highEl = document.getElementById('high');
const tile = 20;
const tiles = canvas.width / tile;
let snake;
let dir;
let nextDir;
let food;
let score;
let high = parseInt(localStorage.getItem('snake_high')||'0',10);
let speed;
let timer;
let running;
const bgm = new Audio(encodeURI('뱀의 춤.mp3'));
bgm.loop = true;
bgm.volume = 0.6;
function ensurePlay(){ bgm.play().catch(()=>{}); }

function randCell() {
  return { x: Math.floor(Math.random()*tiles), y: Math.floor(Math.random()*tiles) };
}
function placeFood() {
  do {
    food = randCell();
  } while (snake.some(s => s.x===food.x && s.y===food.y));
}
function reset() {
  snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dir = {x:1,y:0};
  nextDir = {x:1,y:0};
  score = 0;
  speed = 120;
  running = true;
  scoreEl.textContent = score;
  highEl.textContent = high;
  placeFood();
  startLoop();
  ensurePlay();
}
function startLoop() {
  clearInterval(timer);
  timer = setInterval(tick, speed);
}
function setDir(nx,ny) {
  const rd = {x:nx,y:ny};
  if (snake.length>1 && snake[0].x+rd.x===snake[1].x && snake[0].y+rd.y===snake[1].y) return;
  nextDir = rd;
}
function tick() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if (head.x<0 || head.y<0 || head.x>=tiles || head.y>=tiles) return gameOver();
  if (snake.some(s => s.x===head.x && s.y===head.y)) return gameOver();
  snake.unshift(head);
  if (head.x===food.x && head.y===food.y) {
    score+=1;
    scoreEl.textContent = score;
    if (score%5===0 && speed>60) {
      speed-=10;
      startLoop();
    }
    placeFood();
  } else {
    snake.pop();
  }
  draw();
}
function drawCell(x,y,color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*tile, y*tile, tile, tile);
}
function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  drawCell(food.x, food.y, '#e74c3c');
  for (let i=0;i<snake.length;i++) {
    drawCell(snake[i].x, snake[i].y, i===0 ? '#2ecc71' : '#27ae60');
  }
}
function gameOver() {
  running = false;
  clearInterval(timer);
  if (score>high) {
    high = score;
    localStorage.setItem('snake_high', String(high));
    highEl.textContent = high;
  }
}
document.addEventListener('keydown', e => {
  ensurePlay();
  if (!running && e.key==='Enter') return reset();
  if (e.key==='ArrowUp' || e.key==='w') setDir(0,-1);
  else if (e.key==='ArrowDown' || e.key==='s') setDir(0,1);
  else if (e.key==='ArrowLeft' || e.key==='a') setDir(-1,0);
  else if (e.key==='ArrowRight' || e.key==='d') setDir(1,0);
  else if (e.key===' ') {
    if (!running) return;
    if (timer) {
      clearInterval(timer);
      timer = null;
    } else {
      startLoop();
    }
  }
});
document.getElementById('up').onclick = ()=>{ ensurePlay(); setDir(0,-1); };
document.getElementById('down').onclick = ()=>{ ensurePlay(); setDir(0,1); };
document.getElementById('left').onclick = ()=>{ ensurePlay(); setDir(-1,0); };
document.getElementById('right').onclick = ()=>{ ensurePlay(); setDir(1,0); };
document.getElementById('pause').onclick = ()=>{
  ensurePlay();
  if (!running) return;
  if (timer) {
    clearInterval(timer);
    timer = null;
  } else {
    startLoop();
  }
};
document.getElementById('restart').onclick = ()=>{ ensurePlay(); reset(); };
reset();