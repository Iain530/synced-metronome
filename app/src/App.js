import { useState, useEffect } from 'react';
import { create } from 'timesync';
import { io } from 'socket.io-client';
import config from './config';

import './App.css';

const { timesyncConfig } = config;

// let server = 'https://67ba-2a00-23c5-2d37-b001-a448-5df5-ddc6-3974.ngrok.io';
// server = 'localhost:8081'

const server = timesyncConfig.host + timesyncConfig.serverPath;

var socket = io(server);

const options = {
  server: socket,
  // timeout: 3000,
  // repeat: 10,
  interval: 60000,
}

const ts = create(options);

ts.send = (socket, data, timeout) => {
  return new Promise((resolve, reject) => {
    var timeoutFn = setTimeout(reject, timeout);

    socket.emit('timesync', data, () => {
      clearTimeout(timeoutFn);
      resolve();
    });
  });
};

socket.on('timesync', (data) => {
  //console.log('receive', data);
  ts.receive(null, data);
});

const App = () => {
  const [now, setNow] = useState(Date.now());
  const [offset, setOffset] = useState(0);
  const [synchronizing, setSynchronizing] = useState(true);
  const [syncState, setSyncState] = useState('');

  useEffect(() => {
    setInterval(() => {
      setNow(Date.now());
    }, 50);

    ts.on('change', function (offset) {
      console.log('offset from system time:', offset, 'ms');
      setOffset(offset)
    });

    ts.on('sync', function (state) {
      setSynchronizing(state === 'start');
      console.log('sync ' + state + '');
      setSyncState(state)
    });
  }, []);

  const time = Date.now() + offset

  const bpm = 60;
  const beatsPerBar = 4;

  const millisPerBeat = 60000 / bpm;
  const millisPerBar = millisPerBeat * beatsPerBar

  const number = Math.ceil((time % millisPerBar) / millisPerBeat);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>
            {number}
          </p>
          <div className='sync'>
            {/* {(syncState === 'start' && 'Syncing...') || (syncState === 'end' && 'Synced ✅')} */}
            { synchronizing ? 'Syncing' + '.'.repeat(number) : 'Synced ✅'}
          </div>
        </div>

        <p className='stats'>
          <div>
            Offset: {offset}ms
          </div>
          <div>
            Server: {server}
          </div>
          <div>
            Time: {time}
          </div>
        </p>
      </header>
    </div>
  );
}

export default App;
