module.exports = class BaseController {
  socket;
  store;
  constructor(socket, store) {
    this.socket = socket;
    this.store = store;
  }
};
