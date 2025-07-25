// Initialize Kaboom with debug mode
kaboom({
    global: true,
    width: 800,
    height: 600,
    background: [0, 0, 0],
})

// Game state
let score = 0

// Player movement constants
const SPEED = 300
const JUMP_FORCE = 800

// Add player
const player = add([
    rect(40, 40),
    pos(120, height() - 88),
    color(0, 255, 180),
    area(),
    body(),
    {
        jumpCount: 0,
        maxJumps: 2,
    },
])

// Add score display
const scoreLabel = add([
    text("Score: 0"),
    pos(16, 16),
])

// Simple mobile controls
const mobileControls = {
    left: add([
        rect(100, 100),
        pos(10, height() - 120),
        color(255, 255, 255),
        opacity(0.5),
        area(),
        fixed(),
    ]),
    right: add([
        rect(100, 100),
        pos(120, height() - 120),
        color(255, 255, 255),
        opacity(0.5),
        area(),
        fixed(),
    ]),
    jump: add([
        rect(100, 100),
        pos(width() - 110, height() - 120),
        color(255, 255, 255),
        opacity(0.5),
        area(),
        fixed(),
    ])
}

// Add simple text labels
add([
    text("←"),
    pos(45, height() - 80),
    color(0, 0, 0),
    fixed(),
])

add([
    text("→"),
    pos(155, height() - 80),
    color(0, 0, 0),
    fixed(),
])

add([
    text("JUMP"),
    pos(width() - 90, height() - 80),
    color(0, 0, 0),
    fixed(),
])

// Mobile touch controls
let isMovingLeft = false
let isMovingRight = false

// Touch handlers
mobileControls.left.onClick(() => {
    player.move(-SPEED, 0)
})

mobileControls.right.onClick(() => {
    player.move(SPEED, 0)
})

mobileControls.jump.onClick(() => {
    if (player.isGrounded() || player.jumpCount < player.maxJumps) {
        player.jump(JUMP_FORCE)
        player.jumpCount++
    }
})

// Keep keyboard controls for desktop
onKeyDown("left", () => {
    player.move(-SPEED, 0)
})

onKeyDown("right", () => {
    player.move(SPEED, 0)
})

onKeyPress("space", () => {
    if (player.isGrounded() || player.jumpCount < player.maxJumps) {
        player.jump(JUMP_FORCE)
        player.jumpCount++
    }
})

// Add platforms
add([
    rect(width(), 48),
    pos(0, height() - 48),
    color(255, 255, 255),
    area(),
    solid(),
])

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

// Add enemies
const enemy1 = addEnemy(300, height() - 240)
const enemy2 = addEnemy(600, height() - 340)
const enemy3 = addEnemy(100, height() - 440)

// Move enemies
onUpdate("enemy", (e) => {
    if (e.moveRight) {
        e.pos.x += e.speed * dt()
        if (e.pos.x > e.startX + 200) e.moveRight = false
    } else {
        e.pos.x -= e.speed * dt()
        if (e.pos.x < e.startX) e.moveRight = true
    }
})

// Reset jump count when landing
player.onGround(() => {
    player.jumpCount = 0
    // Add score when landing on platforms
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
})
