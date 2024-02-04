class Game {
    #settings
    #status = 'pending'
    #player1
    #player2
    #google

    constructor() {
        this.#settings = new Settings(4, 5)

    }

    #getRandomPosition(coordinates) {
        let newX
        let newY

        do {
            newX = NumberUtils.getRandomPosition(1, this.#settings.gridSize.rows)
            newY = NumberUtils.getRandomPosition(1, this.#settings.gridSize.columns)
        }

        while (coordinates.some(
            (coord) => coord.x === newX && coord.y === newY
        ) )

        return {x: newX, y: newY}
    }

    get settings() {
        return this.#settings
    }

    set settings(gridSizeSettings) {
        this.#settings = gridSizeSettings

    }

    get player1(){
        return this.#player1
    }

    get player2(){
        return this.#player2
    }

    get status() {
        return this.#status
    }

    get google(){
        return this.#google
    }

    async start() {
        if (this.#status === 'pending') {
            this.#status = 'in-progress'
            this.#player1 = new Player(NumberUtils.getRandomPosition(1, this.#settings.gridSize.rows),NumberUtils.getRandomPosition(1, this.#settings.gridSize.columns))
            const positionPlayer2 = this.#getRandomPosition([this.#player1.position])
            this.#player2 = new Player(positionPlayer2.x, positionPlayer2.y)
            const positionGoogle = this.#getRandomPosition([this.#player1.position, this.#player2.position])
            this.#google = new Google( positionGoogle.x, positionGoogle.y)
        }

    }

}


class Settings {
    #gridSize;

    constructor(columns, rows) {
        this.#gridSize = {
            columns,
            rows
        }
    }

    get gridSize() {
        return this.#gridSize
    }

    set gridSize(newGridSize) {
        this.#gridSize = newGridSize
    }
}

class Unit {
    #position


    constructor(x, y) {
        this.#position = new Position(x, y)
    }

    get position() {
        return this.#position
    }
}
class Google extends Unit{
constructor(x,y) {
    super(x,y);
}
}

class Player extends Unit {
    constructor(x,y) {
        super(x,y);
    }
}

class NumberUtils {
    static getRandomPosition(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

class Position {
    #x
    #y

    constructor(x, y) {
        this.#x = x
        this.#y = y

    }

    get x (){
     return this.#x
    }
    get y (){
        return this.#y
    }

}

module.exports = {
    Game,
    Settings,
    Player,
    NumberUtils,
    Position
}