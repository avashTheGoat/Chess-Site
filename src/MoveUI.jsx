import './MoveUI.css';

export default function MoveUI({moveNum, whiteMove, blackMove, topMargin, bottomMargin}) {
    return (
        <>
            <div className='moveUI' style={{marginTop: `${topMargin}px`, marginBottom: `${bottomMargin}px`}}>
                <div className='moveUiContainer'><p className='moveNum'>{moveNum}.</p></div>
                <div className='moveUiContainer'><p className='whiteMove'>{whiteMove}</p></div>
                <div className='moveUiContainer'><p className='blackMove'>{blackMove}</p></div>
            </div>
        </>
    )
}