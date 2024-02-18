export class EventEmitter {
    #subscribes={}


    addEventListener(nameEvent, observer) {
        return this.subscribe(nameEvent, observer)

    }

    on(nameEvent, observer) {
        return this.subscribe(nameEvent, observer)

    }

    off(nameEvent, observer) {
        this.findAndRemoveObserver(nameEvent, observer)
    }

    findAndRemoveObserver(nameEvent, observer){
        this.#subscribes[nameEvent] = this.#subscribes[nameEvent].filter(subscriber => subscriber !== observer
        )
    }

    subscribe(nameEvent, observer) {

        if (!this.#subscribes[nameEvent]) {
            this.#subscribes[nameEvent] = []
        }

        this.#subscribes[nameEvent].push(observer)
        return () => {
            this.findAndRemoveObserver(nameEvent, observer)
        }


    }

    emit(nameEvent, data = null) {
        this.#subscribes[nameEvent]?.forEach(subscriber => {
            subscriber(data)
        })
    }
}