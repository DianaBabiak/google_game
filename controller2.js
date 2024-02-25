import {Game} from './game.js'
import {EventEmitter} from './utils/eventEmitter/EventEmitter.js'
import {GameComponent} from "./GameComponent.js";

export const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}

export class Controller2 {
    #game


    constructor(game, wsAdapter) {
        this.#game = game



    }

    movePlayer(direction, playerNumber) {
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

