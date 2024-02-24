import {EventsFactory, Game, MODE} from './game.js'
import {EventEmitter} from './utils/eventEmitter/EventEmitter.js'
import {GameComponent} from "./GameComponent.js";
import {Controller1} from "./controller1.js";
import {socket, WSAdapter} from "./front/ws-adapter.js";


const start = async () => {
    const eventEmitter = new EventEmitter()
    const eventsFactory = new EventsFactory()
    const wsAdapter = new WSAdapter(socket)
    const game = new Game(eventEmitter, eventsFactory)
    game.settings.mode=MODE.CLIENT
    await game.start()
    const controller = new Controller1(game,wsAdapter)
    const view = new GameComponent(controller, game)
    view.render()

}

start()

