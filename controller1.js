import {Game} from './game.js'
import {EventEmitter} from './utils/eventEmitter/EventEmitter.js'
import {GameComponent} from "./GameComponent.js";

export const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}

export class Controller1 {
    #game
    #wsAdapter


    constructor(game, wsAdapter) {
        this.#game = game
        this.#wsAdapter = wsAdapter
        this.#wsAdapter.subscribe('new-message', (event) => {
            if (event.type === "GOOGLE/JUMPED") {
                this.#game.setGooglePosition(event.payload.x, event.payload.y)
            }

            if (event.type === "PLAYER/MOVE") {
                this.#reallyMovePlayer(event.payload.direction, event.payload.numberPlayer)
            }
            if (event.type === "PLAYER/STARTED_POSITIONS_SET") {
                this.#game.setPlayerPosition(event.payload.x, event.payload.y, event.payload.playerNumber)
            }


        })

    }

    movePlayer(direction, playerNumber) {
        this.#wsAdapter.send({
            commandType: "MOVE-PLAYER",
            payload: {
                direction,
                playerNumber
            }
        })
    }

    #reallyMovePlayer(direction, playerNumber) {
        switch (direction) {
            case DIRECTION.UP:
                this.#game[`movePlayer${playerNumber}ToUp`]()
                break;
            case DIRECTION.DOWN:
                this.#game[`movePlayer${playerNumber}ToUnder`]()
                break;

            case DIRECTION.RIGHT:
                this.#game[`movePlayer${playerNumber}ToRight`]()
                break;

            case DIRECTION.LEFT:
                this.#game[`movePlayer${playerNumber}ToLeft`]()
                break;

        }
    }


}
