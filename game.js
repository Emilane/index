const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 300, width: 30, height: 30, speed: 5, color: "#ff5733" };
let snowflakes = [];
let hearts = [];  // Khai báo mảng hearts để chứa các trái tim
let score = 0;

// Tạo hiệu ứng tuyết rơi
function createSnowflakes() {
    for (let i = 0; i < 60; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 1
        });
    }
}

// Vẽ tuyết rơi
function drawSnowflakes() {
    ctx.fillStyle = "white";
    snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
        flake.y += flake.speed;
        if (flake.y > canvas.height) flake.y = 0;
    });
}

// Tạo phần tử SVG và chuyển nó thành hình ảnh
const svgHeart = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg>`;
const heartImage = new Image();
heartImage.src = 'data:image/svg+xml;base64,' + btoa(svgHeart);

// Tạo trái tim với hiệu ứng morph
function createHeart() {
    hearts.push({
        x: Math.random() * (canvas.width - 20),
        y: -20,
        width: 20,
        height: 20,
        speed: 3,
        scale: Math.random() * 0.3 + 1,
        morphRate: Math.random() * 0.05 + 0.02
    });
}

// Vẽ trái tim bằng hình ảnh SVG
function drawHeart() {
    hearts.forEach((heart, index) => {
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.scale(heart.scale, heart.scale);
        ctx.drawImage(heartImage, -heart.width / 2, -heart.height / 2, heart.width, heart.height);
        ctx.restore();

        heart.y += heart.speed;
        heart.scale += heart.morphRate;
        if (heart.scale > 1.3 || heart.scale < 1) heart.morphRate *= -1;

        // Xóa trái tim khi rơi ra khỏi màn hình
        if (heart.y > canvas.height) {
            hearts.splice(index, 1);
        }

        // Kiểm tra va chạm với người chơi
        if (
            player.x < heart.x + heart.width &&
            player.x + player.width > heart.x &&
            player.y < heart.y + heart.height &&
            player.y + player.height > heart.y
        ) {
            hearts.splice(index, 1);
            score++;
        }
    });
}

// Điều khiển người chơi
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (player.x > 0) player.x -= player.speed;
            break;
        case "ArrowRight":
            if (player.x + player.width < canvas.width) player.x += player.speed;
            break;
    }
}

// Vòng lặp trò chơi
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnowflakes();
    drawPlayer();
    drawHeart();
    
    // Hiển thị điểm
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Sự kiện và khởi tạo
document.addEventListener("keydown", movePlayer);
createSnowflakes();
setInterval(createHeart, 1500);
gameLoop();

