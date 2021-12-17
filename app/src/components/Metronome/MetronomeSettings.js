import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaMinus, FaPlus} from 'react-icons/fa';

const defaultSettings = {
  bpm: 60,
  timeSignature: [4, 4],
};

const timeSignatures = [
  [2, 2],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 8],
  [6, 8],
];

const timeSignatureButtons = [
  {
    label: "2/2",
    value: 0,
    variant: "secondary",
  }, {
    label: "2/4",
    value: 1,
    variant: "secondary",
  },
]

const parseTimeSignature = (timeSignatureString) => {
  if (!timeSignatureString) return null;
  const timeSignature = timeSignatureString.split('|').map(t => parseInt(t));
  return timeSignature.every(Number.isInteger) && timeSignature.length === 2 && timeSignature;
};


const parseSettingsFromQuery = (query) => {
  const querySettings = {
    bpm: parseInt(query.get('bpm')) || defaultSettings.bpm,
    timeSignature: parseTimeSignature(query.get('timeSignature')) || defaultSettings.timeSignature,
  };

  return {
    ...defaultSettings,
    ...querySettings,
  };
};

const toSearchParamString = (settings) => {
  const params = {
    ...settings,
    timeSignature: settings.timeSignature.join('|'),
  };
  return new URLSearchParams(params).toString()
};


const equalTs = (a, b) => (
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((val, index) => val === b[index])
);

const formatTimeSignature = (ts) => (
  <div className="time-signature">
    <div>{ts[0]}</div>
    <div>{ts[1]}</div>
  </div>
); //`${ts[0]}/${ts[1]}`;


const MetronomeSettings = ({ settings }) => {
  const navigate = useNavigate();

  const updateSettings = useCallback((newSettings) => {
    console.log("Settings updated", newSettings)
    const combinedSettings = {
      ...settings,
      ...newSettings,
    };

    navigate({
      pathname: '/',
      search: toSearchParamString(combinedSettings),
    });
  }, [navigate, settings]);

  return (
    <div className="metronome-settings">
      <Form>
        <Form.Group>
          <div className="settings-summary">{settings.bpm} BPM {formatTimeSignature(settings.timeSignature)}</div>
          <div className="bpm-control">
            <Button variant="secondary" onClick={() => updateSettings({ bpm: settings.bpm - 1 })}><FaMinus /></Button>
            <Form.Range variant="secondary" min={40} max={220} value={settings.bpm} onChange={(e) => updateSettings({bpm: e.target.value})}/>
            <Button variant="secondary" onClick={() => updateSettings({ bpm: settings.bpm + 1 })}><FaPlus /></Button>
          </div>
          <div className="time-sig-control">
            {timeSignatures.map((ts, i) => (
                <Button variant="secondary" key={i} onClick={() => updateSettings({ timeSignature: ts })}>{formatTimeSignature(ts)}</Button>
            ))}
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

MetronomeSettings.defaultProps = {
  initialSettings: {},
}

export default MetronomeSettings;
export {
  defaultSettings,
  parseSettingsFromQuery,
};
