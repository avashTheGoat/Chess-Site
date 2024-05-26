import './MoveUI.css';

export default function MoveUI({moveNum, whiteMove, blackMove}) {
    return (
        <>
            <div className='moveUI'>
                <div className='moveUiContainer'><p className='moveNum'>{moveNum}.</p></div>
                <div className='moveUiContainer'><p className='whiteMove'>{whiteMove}</p></div>
                <div className='moveUiContainer'><p className='blackMove'>{blackMove}</p></div>
            </div>
        </>
    )
}