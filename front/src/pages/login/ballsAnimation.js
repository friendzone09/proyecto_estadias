export default function startAnimation() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  const colors = ['#f31010', '#0a40db'];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radio = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
      this.dirX = Math.random() * 2 - 1;
      this.dirY = Math.random() * 2 - 1;
      this.speed = Math.random() * (3 - 1 + 1) + 1;

      // 🔵 Color aleatorio fijo para esta bola
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

    move() {
      this.x += this.dirX * this.speed;
      this.y += this.dirY * this.speed;

      if (this.x + this.radio > canvas.width || this.x - this.radio < 0) {
        this.dirX *= -1;
      }

      if (this.y + this.radio > canvas.height || this.y - this.radio < 0) {
        this.dirY *= -1;
      }
    }
  }

  let bolas = [];

  for (let i = 0; i < 15; i++) {
    let positionX = Math.floor(Math.random() * canvas.width);
    let positionY = Math.floor(Math.random() * canvas.height);
    bolas.push(new Ball(positionX, positionY));
  }

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bolas.forEach((bola) => {
      bola.draw();
      bola.move();
    });

    requestAnimationFrame(animar);
  }

  animar();
}