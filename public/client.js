const GAME_FPS = 30
const PLAYER_SPEED = 2
const socket = io()

const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight })
document.body.appendChild(app.view)

const shape = new PIXI.Graphics()
shape.beginFill(0xff0000)
shape.lineStyle(0)
shape.drawCircle(50, 50, 5)
shape.endFill()
app.stage.addChild(shape)

const serverShape = new PIXI.Graphics()
serverShape.beginFill(0x0000ff)
serverShape.lineStyle(0)
serverShape.drawCircle(50, 50, 5)
serverShape.endFill()
app.stage.addChild(serverShape)

let moving = false

const update = () => {
    if (moving) {
        shape.position.x += PLAYER_SPEED
    }
}

const start = () => {
    setInterval(() => {
        update()
    }, 1000 / GAME_FPS)
}

socket.on('world', world => {
    if (!Object.values(world).length) {
        return
    }
    const player = Object.values(world)[0]
    serverShape.position.x = player.x
})

document.body.addEventListener('keydown', e => {
    if (e.keyCode === 32) {
        moving = !moving
        socket.emit('moving', moving)
    }
})

start()
