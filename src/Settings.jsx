import { forwardRef, useImperativeHandle, useState } from 'react'
import './Settings.css'

const Settings = forwardRef(({ onLoadFen }, ref) => {
    const [isDisplayed, setIsDisplayed] = useState(false);
    
    const [numPlies, setNumPlies] = useState(3);
    const [shouldUseQuiescence, setQuiescence] = useState(true);
    const [fen, setFen] = useState('');

    useImperativeHandle(ref, () => {
        return {
            toggleDisplay() {
                setIsDisplayed(isDisplayed => !isDisplayed);
            },

            getNumPlies() {
                return numPlies;
            },

            getQuiescence() {
                return shouldUseQuiescence;
            }
        }
    });

    function turnOff() {
        setIsDisplayed(false);
    }

    return (
        <>
            <div id="settings" style={{display: !isDisplayed ? 'none' : 'block'}}>
                <div id="settingsMenu">
                    <div id='top'>
                        <h2 id="settingsMenuTitle">
                            Settings
                        </h2>

                        <button id="settingsClose" className="redBtn" onClick={turnOff}>
                            <p>
                                X
                            </p>
                        </button>
            
                    </div>

                    <div id='engineSettings'>
                        <h3 className="settingsHeader">
                            Engine
                        </h3>

                        <div id="plies" className="settingsItem">
                            <input id="pliesSlider" type="range" min="1" max="4" value={numPlies}
                            onChange={(e) => setNumPlies(e.target.value)}/>
                            <label id="pliesDisplay">
                                Plies: {numPlies}
                            </label>
                            <label>
                                <small><small>&#40;# of 1/2 moves seen&#41;</small></small>
                            </label>
                        </div>

                        <div id="quiescence" className="settingsItem">
                            <label>
                                Quiescence
                                <small><small>&#40;anti-blunder&#41;</small></small>
                                :
                            </label>
                            <input type="checkbox" id="useQuiescenceInput" value={shouldUseQuiescence}
                            onChange={(e) => setQuiescence(e.target.value)} defaultChecked/>
                        </div>
                    </div>

                    <div id='positionSettings'>
                        <h3 className="settingsHeader">
                            Position
                        </h3>

                        <div id="initialFen" className="settingsItem">
                            <label>Starting FEN:</label>
                            <input type="text" id="initialFenInput" value={fen}
                             onChange={(e) => setFen(e.target.value)}/>
                            <button id="loadFenButton" onClick={() => {
                                if (!onLoadFen)
                                    return;
                                onLoadFen(fen);
                            }}>
                                <p>
                                    Load FEN
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>)
});

export default Settings;