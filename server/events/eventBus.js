const EventEmitter = require('events');
const eventBus = new EventEmitter();

eventBus.emitAsync = function (event, data) {
    return new Promise((resolve, reject) => {
        this.emit(event, data, { resolve, reject });
    });
};

module.exports = eventBus;
// This code creates an instance of EventEmitter and exports it for use in other modules.