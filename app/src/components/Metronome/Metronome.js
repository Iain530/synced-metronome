import { useState } from 'react';
import useInterval from '../../utils/useInterval';
import './Metronome.css';


const Metronome = ({ offset, timeSignature, bpm }) => {
  const [time, setTime] = useState(Date.now() + offset);

  useInterval(() => {
    setTime(Date.now() + offset);
  }, 1000 / 60);

  const [beatsPerMeasure, denominator] = timeSignature;

  const millisPerBeat = 60000 / bpm;
  const millisPerBar = millisPerBeat * beatsPerMeasure

  const number = Math.ceil((time % millisPerBar) / millisPerBeat);

  return (
    <p>
      { number }
    </p>
  );
};

export default Metronome;
