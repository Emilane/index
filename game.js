const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 300, width: 30, height: 30, speed: 5, color: "#ff5733" };
let snowflakes = [];
let gifts = [];
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

// Tạo quà tặng với hiệu ứng morph
function createGift() {
    gifts.push({
        x: Math.random() * (canvas.width - 20),
        y: -20,
        width: 20,
        height: 20,
        speed: 3,
        scale: Math.random() * 0.3 + 1,
        morphRate: Math.random() * 0.05 + 0.02
    });
}

// Vẽ quà tặng
function drawGifts() {
    gifts.forEach((gift, index) => {
        ctx.save();
        ctx.translate(gift.x + gift.width / 2, gift.y + gift.height / 2);
        ctx.scale(gift.scale, gift.scale);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.fillRect(-gift.width / 2, -gift.height / 2, gift.width, gift.height);
        ctx.restore();

        gift.y += gift.speed;
        gift.scale += gift.morphRate;
        if (gift.scale > 1.3 || gift.scale < 1) gift.morphRate *= -1;

        // Xóa quà tặng khi rơi ra khỏi màn hình
        if (gift.y > canvas.height) {
            gifts.splice(index, 1);
        }

        // Kiểm tra va chạm với người chơi
        if (
            player.x < gift.x + gift.width &&
            player.x + player.width > gift.x &&
            player.y < gift.y + gift.height &&
            player.y + player.height > gift.y
        ) {
            gifts.splice(index, 1);
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
    drawGifts();
    
    // Hiển thị điểm
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Sự kiện và khởi tạo
document.addEventListener("keydown", movePlayer);
createSnowflakes();
setInterval(createGift, 1500);
gameLoop();
