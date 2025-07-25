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
    rect(40, 40),  // Player size
    pos(120, height() - 88),  // Position just above ground platform
    color(0, 255, 180),  // Teal color
    area(),
    body(),
    {
        jumpCount: 0,
        maxJumps: 2,  // Allow double jump
    },
])

// Add score display
const scoreLabel = add([
    text("Score: 0"),
    pos(16, 16),
])

// Add platforms
// Ground platform
add([
    rect(width(), 48),
    pos(0, height() - 48),
    area(),
    solid(),
    color(255, 255, 255),  // White color
])

// Floating platforms
add([
    rect(200, 20),
    pos(300, height() - 200),
    area(),
    solid(),
    color(255, 255, 255),  // White color
])

add([
    rect(200, 20),
    pos(600, height() - 300),
    area(),
    solid(),
    color(255, 255, 255),  // White color
])

add([
    rect(200, 20),
    pos(100, height() - 400),
    area(),
    solid(),
    color(255, 255, 255),  // White color
])

// Add moving platform
const movingPlatform = add([
    rect(100, 20),
    pos(400, height() - 250),
    area(),
    solid(),
    color(200, 200, 255),  // Light blue color
    {
        moveRight: true,
        speed: 80,
        startX: 400,
    },
])

// Add spikes
function addSpike(x, y) {
    return add([
        rect(20, 20),
        pos(x, y),
        color(255, 255, 0),  // Yellow color
        area(),
        "spike",
        rotate(45),  // Rotate to make it look like a spike
    ])
}

// Add spikes to platforms
const spikes = [
    addSpike(400, height() - 220),
    addSpike(700, height() - 320),
    addSpike(150, height() - 420),
]

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
const enemies = [
    addEnemy(300, height() - 240),
    addEnemy(600, height() - 340),
    addEnemy(100, height() - 440),
    addEnemy(400, height() - 540),  // New enemy
    addEnemy(200, height() - 340),  // New enemy
]

// Add bouncing platform
const bouncePad = add([
    rect(60, 20),
    pos(500, height() - 100),
    area(),
    solid(),
    color(255, 150, 150),  // Pink color
    "bouncer",
])

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
        if (movingPlatform.pos.x > movingPlatform.startX + 200) 
            movingPlatform.moveRight = false
    } else {
        movingPlatform.pos.x -= movingPlatform.speed * dt()
        if (movingPlatform.pos.x < movingPlatform.startX) 
            movingPlatform.moveRight = true
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

// Handle enemy and spike collision
player.onCollide("enemy", () => {
    player.pos = vec2(120, height() - 88)
    score = 0
    scoreLabel.text = "Score: 0"
    player.jumpCount = 0
})

player.onCollide("spike", () => {
    player.pos = vec2(120, height() - 88)
    score = 0
    scoreLabel.text = "Score: 0"
    player.jumpCount = 0
})

// Super jump on bouncer
player.onCollide("bouncer", () => {
    player.jump(JUMP_FORCE * 1.5)  // Higher jump from bounce pad
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
