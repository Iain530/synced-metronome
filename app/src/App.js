import { useState, useEffect, useMemo } from 'react';
import { create } from 'timesync';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import config from './config';

import Metronome, { MetronomeSettings, parseSettingsFromQuery } from './components/Metronome';
import ShareButton from './components/ShareButton';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const { timesyncConfig } = config;

const server = timesyncConfig.host;

var socket = io.connect(server, {
  path: `${timesyncConfig.serverPath}socket.io`,
});

const ts = create({
  server: socket,
  interval: 60000 * 5,
});

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
  ts.receive(null, data);
});


const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};


const App = () => {
  const [offset, setOffset] = useState(0);
  const [synchronizing, setSynchronizing] = useState(true);
  const [syncState, setSyncState] = useState('');

  const query = useQuery();
  const settings = parseSettingsFromQuery(query);

  useEffect(() => {
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

  const { bpm, timeSignature } = settings;

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Metronome offset={offset} {...settings} />
          <div className='sync'>
            { synchronizing ? 'Syncing...' : 'Synced ✅'}
          </div>
          <MetronomeSettings settings={settings} />
          <ShareButton title={`Synced Metronome at ${bpm} BPM in ${timeSignature[0]}/${timeSignature[1]}`} />
        </div>

        <div className='stats'>
          <div>
            System clock offset: {Math.round(offset)}ms
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
