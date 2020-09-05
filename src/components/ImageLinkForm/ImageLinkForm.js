import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <div>
                <p className="f3">
                    {'Throw any picture with a face, and the algorithm will detect it!'}
                </p>
            </div>

            <div className='center '>
                <div className='form center pa4 br3 shadow-1'>
                    <input className='f4 pa2 w-70 center' type="tex" onChange={onInputChange} />
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;