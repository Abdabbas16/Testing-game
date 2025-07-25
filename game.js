// Initialize Kaboom with debug mode
kaboom({
    global: true,
    width: 800,
    height: 600,
    background: [0, 0, 0],
    debug: true,
    touchToMouse: true,
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
    fixed(),
])

// Mobile Controls - Bigger and better positioned
const buttonSize = 120
const buttonOpacity = 0.5
const buttonY = height() - buttonSize - 20

// Left button
const leftButton = add([
    rect(buttonSize, buttonSize),
    pos(20, buttonY),
    color(255, 255, 255),
    opacity(buttonOpacity),
    area(),
    fixed(),
    "mobile-control",
    "left-button",
])

// Right button
const rightButton = add([
    rect(buttonSize, buttonSize),
    pos(buttonSize + 40, buttonY),
    color(255, 255, 255),
    opacity(buttonOpacity),
    area(),
    fixed(),
    "mobile-control",
    "right-button",
])

// Jump button - on the right side
const jumpButton = add([
    rect(buttonSize, buttonSize),
    pos(width() - buttonSize - 20, buttonY),
    color(255, 255, 255),
    opacity(buttonOpacity),
    area(),
    fixed(),
    "mobile-control",
    "jump-button",
])

// Add button labels with centered positioning
add([
    text("←", { size: 48 }),
    pos(20 + buttonSize/2 - 12, buttonY + buttonSize/2 - 24),
    color(0, 0, 0),
    fixed(),
    "mobile-control",
])

add([
    text("→", { size: 48 }),
    pos(buttonSize + 40 + buttonSize/2 - 12, buttonY + buttonSize/2 - 24),
    color(0, 0, 0),
    fixed(),
    "mobile-control",
])

add([
    text("JUMP", { size: 32 }),
    pos(width() - buttonSize/2 - 20 - 32, buttonY + buttonSize/2 - 16),
    color(0, 0, 0),
    fixed(),
    "mobile-control",
])

// Mobile touch controls
let isMovingLeft = false
let isMovingRight = false

// Touch handlers for movement
onClick("left-button", () => {
    isMovingLeft = true
})

onClick("right-button", () => {
    isMovingRight = true
})

onTouchEnd("left-button", () => {
    isMovingLeft = false
})

onTouchEnd("right-button", () => {
    isMovingRight = false
})

onClick("jump-button", () => {
    if (player.isGrounded() || player.jumpCount < player.maxJumps) {
        player.jump(JUMP_FORCE)
        player.jumpCount++
    }
})

// Continuous movement update
onUpdate(() => {
    if (isMovingLeft) {
        player.move(-SPEED, 0)
    }
    if (isMovingRight) {
        player.move(SPEED, 0)
    }
})

// Keep keyboard controls for desktop
keyDown("left", () => {
    player.move(-SPEED, 0)
})

keyDown("right", () => {
    player.move(SPEED, 0)
})

keyPress("space", () => {
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
