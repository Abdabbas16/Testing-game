// Initialize Kaboom with debug mode
kaboom({
    global: true,
    width: 800,
    height: 600,
    background: [0, 0, 0],
    debug: true,
})

// Game state
let score = 0

// Player movement constants
const SPEED = 300      // Updated from 200 to 300
const JUMP_FORCE = 800  // Updated from 500 to 800

// Add player
const player = add([
    rect(40, 40),  // Player size
    pos(120, height() - 88),  // Position just above ground platform
    color(0, 255, 180),  // Teal color
    area(),
    body(),
    {
        // Custom properties
        jumpCount: 0,
        maxJumps: 2,  // Allow double jump
    },
])

// Add score display
const scoreLabel = add([
    text("Score: 0"),
    pos(16, 16),
])

// Add ground
add([
    rect(width(), 48),
    pos(0, height() - 48),
    color(255, 255, 255),
    area(),
    solid(),
])

// Add platforms - Now with more platforms at various heights and positions
add([
    rect(200, 20),
    pos(300, height() - 200),
    color(255, 255, 255),
    area(),
    solid(),
])

add([
    rect(200, 20),
    pos(600, height() - 300),
    color(255, 255, 255),
    area(),
    solid(),
])

add([
    rect(200, 20),
    pos(100, height() - 400),
    color(255, 255, 255),
    area(),
    solid(),
])

// Additional platforms
add([
    rect(150, 20),
    pos(400, height() - 500),
    color(255, 255, 255),
    area(),
    solid(),
])

add([
    rect(150, 20),
    pos(700, height() - 450),
    color(255, 255, 255),
    area(),
    solid(),
])

add([
    rect(150, 20),
    pos(200, height() - 350),
    color(255, 255, 255),
    area(),
    solid(),
])

// Moving platform
const movingPlatform = add([
    rect(100, 20),
    pos(400, height() - 250),
    color(200, 200, 255),  // Light blue color
    area(),
    solid(),
    {
        moveRight: true,
        startX: 400,
        speed: 80,
    },
])

// Add enemies
function addEnemy(x, y) {
    return add([
        rect(30, 30),
        pos(x, y),
        color(255, 0, 0),
        area(),
        {
            startX: x,
            speed: 100,
            moveRight: true,
        },
        "enemy"
    ])
}

// Add more enemies at different positions
const enemy1 = addEnemy(300, height() - 240)
const enemy2 = addEnemy(600, height() - 340)
const enemy3 = addEnemy(100, height() - 440)
const enemy4 = addEnemy(400, height() - 540)  // New enemy
const enemy5 = addEnemy(200, height() - 390)  // New enemy
const enemy6 = addEnemy(700, height() - 490)  // New enemy

// Move enemies back and forth
onUpdate("enemy", (e) => {
    if (e.moveRight) {
        e.pos.x += e.speed * dt()
        if (e.pos.x > e.startX + 200) e.moveRight = false
    } else {
        e.pos.x -= e.speed * dt()
        if (e.pos.x < e.startX) e.moveRight = true
    }
})

// Move the moving platform
onUpdate(() => {
    if (movingPlatform.moveRight) {
        movingPlatform.pos.x += movingPlatform.speed * dt()
        if (movingPlatform.pos.x > movingPlatform.startX + 300) movingPlatform.moveRight = false
    } else {
        movingPlatform.pos.x -= movingPlatform.speed * dt()
        if (movingPlatform.pos.x < movingPlatform.startX) movingPlatform.moveRight = true
    }
})

// Basic controls
keyDown("left", () => {
    player.move(-SPEED, 0)
})

keyDown("right", () => {
    player.move(SPEED, 0)
})

// Jump control with double jump
keyPress("space", () => {
    // Can jump if grounded or have remaining jumps
    if (player.isGrounded() || player.jumpCount < player.maxJumps) {
        player.jump(JUMP_FORCE)
        player.jumpCount++
    }
})

// Reset jump count when landing
player.onGround(() => {
    player.jumpCount = 0
    // Add score when landing on platforms (not ground)
    if (player.pos.y < height() - 88) {
        score += 10
        scoreLabel.text = "Score: " + score
    }
})

// Handle enemy collision
player.onCollide("enemy", () => {
    player.pos = vec2(120, height() - 88)
    score = 0
    scoreLabel.text = "Score: 0"
    player.jumpCount = 0
})

// Keep player in bounds
player.onUpdate(() => {
    // Left and right bounds
    if (player.pos.x < 0) {
        player.pos.x = 0
    }
    if (player.pos.x > width() - 40) {
        player.pos.x = width() - 40
    }
    
    // Reset if player falls off
    if (player.pos.y > height()) {
        player.pos = vec2(120, height() - 88)
        score = 0
        scoreLabel.text = "Score: 0"
        player.jumpCount = 0
    }

    // Debug position info
    debug.log(`Player position: ${Math.floor(player.pos.x)}, ${Math.floor(player.pos.y)}`)
    debug.log(`Jump count: ${player.jumpCount}`)
    debug.log(`Score: ${score}`)
})
