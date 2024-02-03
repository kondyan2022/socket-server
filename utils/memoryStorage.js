class MemoryStorage {
  operatorOnline = new Set();
  userOnline = new Set();
  typing = new Set();
}

const store = new MemoryStorage();

module.exports = store;
