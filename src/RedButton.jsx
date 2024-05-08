import './RedButton.css'

function RedButton({ btnText, onClick }) {
    function tryCallOnClick() {
        if (!onClick)
            return;

        onClick();
    }

    return (
        <>
            <button className='redBtn' onClick={tryCallOnClick}>
                <p>
                    {btnText}
                </p>
            </button>
        </>
    )
}

export default RedButton