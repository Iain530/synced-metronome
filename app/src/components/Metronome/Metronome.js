import { useCallback, useState } from 'react';
import useInterval from '../../utils/useInterval';
import './Metronome.css';

const toLetter = n => (n % 26 + 10).toString(36).toUpperCase();

const Metronome = ({ offset, timeSignature, bpm }) => {
  const [number, setNumber] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  useInterval(() => {
    const time = Date.now() + offset;
    const [beatsPerMeasure, denominator] = timeSignature;

    const millisPerBeat = 60000 / (bpm * denominator / 4);
    const millisPerBar = millisPerBeat * beatsPerMeasure;

    const newLetter = Math.ceil((time % (millisPerBar * 26)) / millisPerBar);
    const newNumber = Math.ceil((time % millisPerBar) / millisPerBeat);
    if (newNumber !== number) {
      setNumber(newNumber);
      setLetterIndex(newLetter);
    }
  }, 10);

  return (
    <div>
      <div className="letters">
        {
          [...Array(4).keys()].map(i => (
            <div>{ toLetter(letterIndex + i) }</div>
          ))
        }
      </div>
      <div>
        { number }
      </div>
    </div>
  );
};

export default Metronome;
