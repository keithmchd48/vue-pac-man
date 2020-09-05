class Ghost {
  constructor(startIndex, speed) {
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.timerId = NaN
  }
}

const WIDTH = 28 //28 x 28 = 784 squares
// 0 - pac-dots
// 1 - wall
// 2 - ghost-lair
// 3 - power-pellet
// 4 - empty

export default {
  name: 'GridWrapper',
  template: `
<div class="grid">
  <div v-for="(lay, ind) in layout" :key="ind"
   :class="{
   'pac-dot': lay === 0,
   'wall': lay === 1,
   'ghost-lair': lay === 2, 
   'power-pellet' : lay === 3,
   'pac-man' : ind === pacmanCurrentIndex,
   'blinky ghost' : ind === blinky.currentIndex,
   'pinky ghost' : ind === pinky.currentIndex,
   'inky ghost' : ind === inky.currentIndex,
   'clyde ghost' : ind === clyde.currentIndex,
   'scared-ghost' : isScared,
   'up' : (ind === pacmanCurrentIndex && faceUp),
   'down' :  (ind === pacmanCurrentIndex && faceDown),
   'right' : (ind === pacmanCurrentIndex && faceRight),
   'left' : (ind === pacmanCurrentIndex && faceLeft)
   }">
   <div v-show="allGhostPositions.includes(ind)" class="eyes"></div>
</div>
<h3>Score: <span id="score">{{score}}</span></h3>
</div>`,
  data () {
    return {
      pacmanFace: 'd',
      layout: [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,4,4,4,4,4,4,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,4,4,4,4,4,4,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,4,4,4,4,4,4,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
      ],
      ghosts: [
        new Ghost(348, 250),
        new Ghost(376, 400),
        new Ghost(351, 300),
        new Ghost(379, 500),
      ],
      score: 0,
      pacmanCurrentIndex: 490,
      isScared: false
    }
  },
  mounted () {
    document.addEventListener('keyup', this.movePacman)
    // move the ghosts randomly
    this.ghosts.forEach(ghost => this.moveGhost(ghost))
  },
  computed: {
    blinky () {
      return this.ghosts[0]
    },
    pinky () {
      return this.ghosts[1]
    },
    inky () {
      return this.ghosts[2]
    },
    clyde () {
      return this.ghosts[3]
    },
    allGhostPositions () {
      return [this.blinky.currentIndex, this.pinky.currentIndex, this.inky.currentIndex, this.clyde.currentIndex]
    },
    faceUp () {
      return this.pacmanFace === 'w'
    },
    faceDown () {
      return this.pacmanFace === 's'
    },
    faceRight () {
      return this.pacmanFace === 'd'
    },
    faceLeft () {
      return this.pacmanFace === 'a'
    }
  },
  methods: {
    movePacman(e) {
      // "keyCode" is deprecated in some browsers
      const codeForPress = this.dispatchForCode(e)
      if (codeForPress === 37 || codeForPress ==='ArrowLeft') {
        this.pacmanFace = 'a'
        if (this.pacmanCurrentIndex % WIDTH !== 0 && this.layout[this.pacmanCurrentIndex - 1] !== 1 && this.layout[this.pacmanCurrentIndex - 1] !== 2) {
          this.pacmanCurrentIndex -= 1
        }
        // left exit
        if (this.pacmanCurrentIndex - 1 === 363) this.pacmanCurrentIndex = 391
      }
      if (codeForPress === 38 || codeForPress ==='ArrowUp') {
        this.pacmanFace = 'w'
        if (this.pacmanCurrentIndex - WIDTH >= 0 && this.layout[this.pacmanCurrentIndex - WIDTH] !== 1 && this.layout[this.pacmanCurrentIndex - WIDTH] !== 2) {
          this.pacmanCurrentIndex -= WIDTH
        }
      }
      if (codeForPress === 39 || codeForPress ==='ArrowRight') {
        this.pacmanFace = 'd'
        if (this.pacmanCurrentIndex % WIDTH < WIDTH - 1 && this.layout[this.pacmanCurrentIndex + 1] !== 1 && this.layout[this.pacmanCurrentIndex + 1] !== 2) {
          this.pacmanCurrentIndex += 1
        }
        // right exit
        if (this.pacmanCurrentIndex + 1 === 392) this.pacmanCurrentIndex = 364
      }
      if (codeForPress === 40 || codeForPress ==='ArrowDown') {
        this.pacmanFace = 's'
        if (this.pacmanCurrentIndex + WIDTH < WIDTH * WIDTH && this.layout[this.pacmanCurrentIndex + WIDTH] !== 1 && this.layout[this.pacmanCurrentIndex + WIDTH] !== 2) {
          this.pacmanCurrentIndex += WIDTH
        }
      }
      this.pacDotEaten()
      this.powerPelletEaten()
      this.checkForGameOver()
      this.checkForWin()
    },
    moveGhost (ghost) {
      const directions = [+1, -1, +WIDTH, -WIDTH]
      let direction = directions[Math.floor(Math.random() * directions.length)]
      ghost.timerId = setInterval(() => {
        // if the next square your ghost is going to go is not a wall and another ghost, then go that way
        if (this.layout[ghost.currentIndex + direction] !== 1 && !this.allGhostPositions.includes(ghost.currentIndex + direction)) {
          // move to new square
          ghost.currentIndex += direction
        }
        // else find a new way
        else {
          direction = directions[Math.floor(Math.random() * directions.length)]
        }
        // if the ghost is scared and runs into pacman
        if (this.isScared && ghost.currentIndex === this.pacmanCurrentIndex) {
          ghost.currentIndex = ghost.startIndex
          this.score += 100
        }
        this.checkForWin()
        this.checkForGameOver()
      }, ghost.speed)
    },
    pacDotEaten () {
      if (this.layout[this.pacmanCurrentIndex] === 0) {
        this.score++
        this.layout[this.pacmanCurrentIndex] = 4
      }
    },
    powerPelletEaten () {
      if (this.layout[this.pacmanCurrentIndex] === 3) {
        this.score += 10
        this.isScared = true
        setTimeout(() => this.isScared = false, 10000)
        this.layout[this.pacmanCurrentIndex] = 4
      }
    },
    checkForGameOver () {
      if (this.allGhostPositions.includes(this.pacmanCurrentIndex) && !this.isScared) {
        // make the pac man disappear
        this.pacmanCurrentIndex = -1
        // stop movement of all ghosts
        this.ghosts.forEach(ghost => clearInterval(ghost.timerId))
        // stop movment of pacman
        document.removeEventListener('keyup', this.movePacman)
        this.score = "GAME OVER"
      }
    },
    checkForWin() {
      if (!this.layout.includes(0)) {
        // stop movement of all ghosts
        this.ghosts.forEach(ghost => clearInterval(ghost.timerId))
        // stop movment of pacman
        document.removeEventListener('keyup', this.movePacman)
        this.score = "YOU WIN"
      }
    },
    dispatchForCode (event) {
      let code
      if (event.key !== undefined) {
        code = event.key;
      } else if (event.keyIdentifier !== undefined) {
        code = event.keyIdentifier;
      } else if (event.keyCode !== undefined) {
        code = event.keyCode;
      }
      return code
    }
  }
}
