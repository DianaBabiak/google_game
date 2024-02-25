import {DIRECTION} from "./controller2.js";

export const MODE = {
    CLIENT: 'client',
    ONLY_CLIENT: 'only-client',
    SERVER: 'server'
}

export class EventsFactory {
    playerMove(delta, numberPlayer) {
        let direction
        if (delta.x > 0) {
            direction = DIRECTION.RIGHT
        }
        if (delta.x < 0) {
            direction = DIRECTION.LEFT
        }
        if (delta.y > 0) {
            direction = DIRECTION.DOWN
        }
        if (delta.y < 0) {
            direction = DIRECTION.UP
        }
        return {
            type: "PLAYER/MOVE",
            payload: {direction, numberPlayer}
        }
    }
    googleJumped(x, y) {
        return {
            type: "GOOGLE/JUMPED",
            payload: {x, y}
        }
    }

    playerStartedPositionSet(x,y,playerNumber){
        return{
            type: "PLAYER/STARTED_POSITIONS_SET",
            payload: {x, y,playerNumber}
        }

    }
}


export class Game {
    #settings
    #status = 'pending'
    #player1
    #player2
    #google
    #score = {
        player1: 0,
        player2: 0
    }
    #idGoogleJumpInterval
    eventEmitter
    #eventFactory


    constructor(eventEmitter, eventFactory) {
        this.#settings = new Settings()
        this.eventEmitter = eventEmitter
        this.#eventFactory = eventFactory

    }

    #getRandomPosition(coordinates) {
        let newX
        let newY

        do {
            newX = NumberUtils.getRandomPosition(1, this.#settings.gridSize.columns)
            newY = NumberUtils.getRandomPosition(1, this.#settings.gridSize.rows)
        }

        while (coordinates.some(
            (coord) => coord.x === newX && coord.y === newY
        ))

        return {x: newX, y: newY}
    }


    #movePlayer(player, otherPlayer, delta) {
        if (this.#status === 'finished') {
            return
        }

        const isBorder = this.#checkBorder(player, delta)
        const isOtherPlayer = this.#checkOtherPlayer(player, otherPlayer, delta)

        if (isBorder) {
            return
        }
        if (isOtherPlayer) {
            return
        }
        if (delta.x) {
            player.position.x += delta.x
        }
        if (delta.y) {
            player.position.y += delta.y
        }
        this.#catchGoogle(player)
        this.eventEmitter.emit("change", this.#eventFactory.playerMove(delta, player.number))

    }

    movePlayer1ToRight() {

        const delta = {x: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)

    }

    movePlayer1ToLeft() {

        const delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)

    }

    movePlayer1ToUp() {
        const delta = {y: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)

    }

    movePlayer1ToUnder() {
        const delta = {y: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)

    }

    movePlayer2ToRight() {
        const delta = {x: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)

    }

    movePlayer2ToLeft() {
        const delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)

    }

    movePlayer2ToUp() {
        const delta = {y: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)

    }

    movePlayer2ToUnder() {
        const delta = {y: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)

    }

    #checkBorder(player, delta) {
        const newPosition = player.position.clone()
        if (delta.x) {
            newPosition.x = newPosition.x + delta.x
            return newPosition.x < 1 || newPosition.x > this.#settings.gridSize.columns;
        }

        if (delta.y) {
            newPosition.y = newPosition.y + delta.y
            return newPosition.y < 1 || newPosition.y > this.#settings.gridSize.rows;
        }

    }

    #checkOtherPlayer(movingPlayer, otherPlayer, delta) {

        const newPosition = movingPlayer.position.clone()
        if (delta.x) {
            newPosition.x = newPosition.x + delta.x

        }
        if (delta.y) {
            newPosition.y = newPosition.y + delta.y
        }

        return newPosition.equal(otherPlayer.position)

    }

    async #catchGoogle(player) {


        if (player.position.equal(this.#google.position)) {
            if (player.number === 1) {
                this.#score.player1++
            } else {
                this.#score.player2++
            }

            if (this.#score.player1 === this.#settings.pointsToWin || this.#score.player2 === this.#settings.pointsToWin) {
                await this.#finishGame()
            } else {
                clearInterval(this.#idGoogleJumpInterval)
                this.#randomGooglePosition()
                this.#runGoogleJumpInterval()

            }
        }
    }

    setGooglePosition(x, y) {
        if (this.#settings.mode !== MODE.CLIENT) {
            throw new Error('imposible control google position')
        }
        this.#google.position = new Position(x, y)
        this.eventEmitter.emit("change", this.#eventFactory.googleJumped(this.#google.position.x, this.#google.position.y))
    }

    setPlayerPosition(x, y,playerNumber) {
        if (this.#settings.mode !== MODE.CLIENT) {
            throw new Error('imposible control player position')
        }
        if(playerNumber===1){
            this.#player1.position = new Position(x, y)
        }
        if(playerNumber===2){
            this.#player2.position = new Position(x, y)
        }

        this.eventEmitter.emit("change")
    }


    #randomGooglePosition() {
        this.eventEmitter.emit("change", this.#eventFactory.googleJumped(this.#google.position.x, this.#google.position.y))

        const newPositionGoogle = this.#getRandomPosition([this.#player1.position, this.#player2.position, this.#google.position])
        this.#google.position = new Position(newPositionGoogle.x, newPositionGoogle.y)


    }

    get score() {
        return this.#score
    }

    get settings() {
        return this.#settings
    }

    set settings(settings) {
        this.#settings = {
            ...this.#settings,
            ...settings
        }
        this.#settings.gridSize = settings.gridSize ? {
            ...this.#settings.gridSize,
            ...settings.gridSize
        } : this.#settings.gridSize

    }

    get player1() {
        return this.#player1
    }

    get player2() {
        return this.#player2
    }

    get status() {
        return this.#status
    }

    get google() {
        return this.#google
    }

    #creatUnits() {
        this.#player1 = new Player({
            x: NumberUtils.getRandomPosition(1, this.#settings.gridSize.columns),
            y: NumberUtils.getRandomPosition(1, this.#settings.gridSize.rows)
        }, 1)
        const positionPlayer2 = this.#getRandomPosition([this.#player1.position])
        this.#player2 = new Player({x: positionPlayer2.x, y: positionPlayer2.y}, 2)
        const positionGoogle = this.#getRandomPosition([this.#player1.position, this.#player2.position])
        this.#google = new Google({x: positionGoogle.x, y: positionGoogle.y})
    }

    #creatUnitsForClientMode() {
        this.#player1 = new Player({
            x: 1,
            y: 1
        }, 1)
        this.eventEmitter.emit('change', this.#eventFactory.playerStartedPositionSet(this.#player1.position.x, this.#player1.position.y,1))
        this.#player2 = new Player({x: 1, y: 2}, 2)
        this.eventEmitter.emit('change', this.#eventFactory.playerStartedPositionSet(this.#player2.position.x, this.#player2.position.y,2))
        this.#google = new Google({x: 1, y: 3});
        this.#runGoogleJumpInterval()



    }

    async start() {
        if (this.#status === 'pending') {

            this.#status = 'in-progress'

            if (this.#settings.mode !== MODE.CLIENT) {
                this.#creatUnits()
                this.#runGoogleJumpInterval()
            } else {
                this.#creatUnitsForClientMode()


            }
            this.score.player1 = 0
            this.score.player2 = 0
        }
    }

    #runGoogleJumpInterval() {
        this.#idGoogleJumpInterval = setInterval(() => {
            this.#randomGooglePosition()
        }, this.#settings.googleJumpInterval)
    }

    async stop() {
        clearInterval(this.#idGoogleJumpInterval)
        this.#status = 'paused'
    }

    async #finishGame() {
        clearInterval(this.#idGoogleJumpInterval)
        this.#status = 'finished'
        this.#randomGooglePosition()
    }
}


class Settings {
    #pointsToWin = 10
    #gridSize
    #googleJumpInterval = 2000
    #mode = MODE.CLIENT

    constructor(columns = 4, rows = 4) {
        this.#gridSize = {
            columns,
            rows
        }
    }

    get mode() {
        return this.#mode
    }

    set mode(newMode) {
        return this.#mode = newMode
    }

    get gridSize() {
        return this.#gridSize
    }

    get pointsToWin() {
        return this.#pointsToWin
    }

    get googleJumpInterval() {
        return this.#googleJumpInterval
    }

    set gridSize(newGridSize) {
        this.#gridSize = newGridSize
    }

    set pointsToWin(newPointsToWin) {
        this.#pointsToWin = newPointsToWin
    }

    set googleJumpInterval(newGoogleJumpInterval) {
        this.#googleJumpInterval = newGoogleJumpInterval
    }

}

class Unit {
    #position


    constructor(obj) {
        this.#position = new Position(obj.x, obj.y)
    }

    get position() {
        return this.#position
    }

    set position(newPosition) {
        return this.#position = newPosition
    }
}

class Google extends Unit {
    constructor(obj) {
        super(obj);
    }
}

class Player extends Unit {
    constructor(obj, number) {
        super(obj);
        this.number = number
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

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    set x(newX) {
        return this.#x = newX
    }

    set y(newY) {
        return this.#y = newY
    }

    clone() {
        return new Position(this.#x, this.#y)
    }

    equal(anotherPosition) {
        return anotherPosition.x === this.#x && anotherPosition.y === this.#y
    }

}

// module.exports = {
//     Game,
//     Settings,
//     Player,
//     NumberUtils,
//     Position
// }