import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaMinus, FaPlus} from 'react-icons/fa';

const defaultSettings = {
  bpm: 60,
  timeSignature: [4, 4],
};


const params = {
  bpm: parseInt,

}


const parseSettingsFromQuery = (query) => {
  const querySettings = {
    bpm: parseInt(query.get('bpm')) || defaultSettings.bpm,
  };

  return {
    ...defaultSettings,
    ...querySettings,
  };
};

const MetronomeSettings = ({ onChange, settings }) => {
  const navigate = useNavigate();

  const updateSettings = useCallback((newSettings) => {
    const params = {
      ...settings,
      ...newSettings,
    };

    navigate({
      pathname: '/',
      search: new URLSearchParams(params).toString(),
    });
  }, [navigate, settings]);

  return (
    <div className="metronome-settings">
      <Form>
        <Form.Group>
          <Form.Label>{settings.bpm} BPM</Form.Label>
          <div className="bpm-control">
            <Button variant="secondary" onClick={() => updateSettings({ bpm: settings.bpm - 1 })}><FaMinus /></Button>
            <Form.Range variant="secondary" min={40} max={220} value={settings.bpm} onChange={(e) => updateSettings({bpm: e.target.value})}/>
            <Button variant="secondary" onClick={() => updateSettings({ bpm: settings.bpm + 1 })}><FaPlus /></Button>
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
