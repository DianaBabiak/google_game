import {Game} from './game.js'
import {EventEmitter} from './utils/eventEmitter/EventEmitter.js'
import {GameComponent} from "./GameComponent.js";


class Controller {
    constructor(model) {
        this.model = model
    }


}


const start = async () => {
    const eventEmitter = new EventEmitter()
    const game = new Game(eventEmitter)
    await game.start()
    const view = new GameComponent(game)

    game.eventEmitter.on("change", () => {
        view.render()
    })
    view.render()
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "ArrowUp":
                game.movePlayer1ToUp()
                break;
            case "ArrowDown":
                game.movePlayer1ToUnder()
                break;

            case "ArrowRight":
                game.movePlayer1ToRight()
                break;

            case "ArrowLeft":
                game.movePlayer1ToLeft()
                break;

        }
    })

    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "KeyW":
                game.movePlayer2ToUp()
                break;
            case "KeyS":
                game.movePlayer2ToUnder()
                break;

            case "KeyD":
                game.movePlayer2ToRight()
                break;

            case "KeyA":
                game.movePlayer2ToLeft()
                break;

        }
    })
}


start()
