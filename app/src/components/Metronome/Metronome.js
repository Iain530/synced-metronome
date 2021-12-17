import { useCallback, useState } from 'react';
import useInterval from '../../utils/useInterval';
import './Metronome.css';

const clickSounds = [
  new Audio('/sounds/click.mp3'),
  new Audio('/sounds/smallclick.mp3'),
  new Audio('/sounds/smallclick.mp3'),
  new Audio('/sounds/smallclick.mp3'),
  new Audio('/sounds/smallclick.mp3'),
  new Audio('/sounds/smallclick.mp3'),
  new Audio('/sounds/smallclick.mp3'),
];

const Metronome = ({ offset, timeSignature, bpm }) => {
  const [number, setNumber] = useState(0);

  useInterval(() => {
    const time = Date.now() + offset;
    const [beatsPerMeasure, denominator] = timeSignature;

    const millisPerBeat = 60000 / (bpm * denominator / 4);
    const millisPerBar = millisPerBeat * beatsPerMeasure
  
    const newNumber = Math.ceil((time % millisPerBar) / millisPerBeat);
    if (newNumber !== number) {
      setNumber(newNumber);
      click(newNumber);
    }
  }, 10);

  const click = useCallback((number) => {
    clickSounds[number - 1].play();
  }, []);

  return  (
    <div>
      { number }
    </div>
  );
};

export default Metronome;
