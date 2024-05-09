import RedButton from './RedButton.jsx';

import './Options.css';

export default function OptionsBar({ onSideClick, onResetClick, onSettingsClick }) {
    function tryCallFunc(func) {
        if (!func)
            return;

        func();
    }

    return (
        <>
        
            <div id='optionsBar'>
                <button style={{marginLeft: '30px'}} onClick={() => tryCallFunc(onSideClick)}>
                    <p>
                        Side: White
                    </p>
                </button>

                <RedButton btnText='Reset' onClick={() => tryCallFunc(onResetClick)}/>

                <button style={{marginLeft: 'auto', marginRight: '30px'}}
                 onClick={() => tryCallFunc(onSettingsClick)}>
                    <p>
                        Settings
                    </p>
                </button>
            </div>
        </>
    )
}