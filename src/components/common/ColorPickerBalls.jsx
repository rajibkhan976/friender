import React, { useState } from 'react';
import Circle from '@uiw/react-color-circle';


const ColorPickerBalls = () => {
    const randomColors = ['#C0A9EB', '#9FC999', '#95D6D4', '#E0A8B8', '#92B0EA', '#D779D9', '#CFC778', '#8A78CF', '#CF7878', '#F2C794'];
    const [hex, setHex] = useState('#F44E3B');


    return (
        <Circle
            colors={randomColors}
            color={hex}
            onChange={(color) => {
                setHex(color.hex);
            }}
        />
    );
};

export default ColorPickerBalls;