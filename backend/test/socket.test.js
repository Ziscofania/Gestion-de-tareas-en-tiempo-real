const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const io = require('socket.io-client');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Socket.IO Tests', () => {
  it('Debería agregar una tarea y emitir evento', (done) => {
    const socket = io.connect('http://localhost:4000');
    socket.emit('addTask', { text: 'Test Task', completed: false });
    socket.on('taskAdded', (task) => {
      expect(task.text).to.equal('Test Task');
      done();
    });
  });
});