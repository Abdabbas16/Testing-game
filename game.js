// Initialize Kaboom
kaboom({
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
add([
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

// Add platforms
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

// Controls
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

// Mobile controls
const touchArea = height() / 3
onClick((p) => {
    if (p.y > height() - touchArea) {
        if (p.x < width() / 3) {
            // Left third of screen
            player.move(-SPEED, 0)
        } else if (p.x > (width() * 2) / 3) {
            // Right third of screen
            player.move(SPEED, 0)
        } else {
            // Middle third of screen
            if (player.isGrounded() || player.jumpCount < player.maxJumps) {
                player.jump(JUMP_FORCE)
                player.jumpCount++
            }
        }
    }
})

// Reset jump count when landing
player.onGround(() => {
    player.jumpCount = 0
    if (player.pos.y < height() - 88) {
        score += 10
        every("score", (s) => {
            s.text = "Score: " + score
        })
    }
})

// Handle enemy collision
player.onCollide("enemy", () => {
    player.pos = vec2(120, height() - 88)
    score = 0
    every("score", (s) => {
        s.text = "Score: 0"
    })
    player.jumpCount = 0
})

// Keep player in bounds
player.onUpdate(() => {
    if (player.pos.x < 0) player.pos.x = 0
    if (player.pos.x > width() - 40) player.pos.x = width() - 40
    
    if (player.pos.y > height()) {
        player.pos = vec2(120, height() - 88)
        score = 0
        every("score", (s) => {
            s.text = "Score: 0"
        })
        player.jumpCount = 0
    }
})
