import React, { useCallback, useRef, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { IoShareOutline } from 'react-icons/io5';

import './ShareButton.css';

const ShareButton = ({ title }) => {
    const supported = navigator.share || navigator?.clipboard?.writeText;
    const target = useRef(null);
    const [show, setShow] = useState(false);

    const onClick = useCallback(() => {
        if (navigator.share) {
            navigator.share({
                title,
                url: window.location.href,
            });
        } else if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(window.location.href);
            setShow(true);
            setTimeout(() => setShow(false), 2000);
        } else {
            alert("Not supported");
        }
    }, [title, setShow]);

    return supported ? (
        <>
            <Button ref={target} onClick={onClick} className="share-button" variant="light">
                <IoShareOutline size="1.5rem" /> Share
            </Button>
            <Overlay target={target.current} show={show} placement="top">
                {(props) => (
                <Tooltip id="overlay-example" {...props}>
                    Copied
                </Tooltip>
                )}
            </Overlay>
        </>
    ) : <></>;
};

export default ShareButton;
