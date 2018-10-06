const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const GAME_FPS = 30
const UPDATE_FPS = 10
const PLAYER_SPEED = 2

const players = {}

class Player {
  constructor () {
    this.position = { x: 0 }
    this.moving = false
  }

  update () {
    if (this.moving) {
      this.position.x += PLAYER_SPEED
    }
  }
}

const getWorld = () => {
  return Object.keys(players).reduce((memo, playerId) => {
    memo[playerId] = players[playerId].position
    return memo
  }, {})
}

// game loop
setInterval(() => {
  Object.values(players).forEach(player => player.update())
}, 1000 / GAME_FPS)


// update loop
setInterval(() => {
  io.emit('world', getWorld())
}, 1000 / UPDATE_FPS)

// socket handler
io.on('connection', function(socket) {
  console.log(`${socket.id} connected`)

  const player = new Player()
  players[socket.id] = player

  socket.on('moving', moving => {
    players[socket.id].moving = moving
  })

  socket.on('disconnect', function () {
    console.log(`${socket.id} disconnected`)
    delete players[socket.id]
  })
})

app.use(express.static('public'))

http.listen(3000, function() {
  console.log('listening on *:3000')
})
