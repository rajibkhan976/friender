import React, { useState } from 'react';
import Circle from '@uiw/react-color-circle';


const ColorPickerBalls = ({ colorPick, setColorPick }) => {
    const randomColors = ['#C0A9EB', '#9FC999', '#95D6D4', '#E0A8B8', '#92B0EA', '#D779D9', '#CFC778', '#8A78CF', '#CF7878', '#F2C794'];
    const [hex, setHex] = useState(colorPick);

    return (
        <Circle
            colors={randomColors}
            color={hex}
            onChange={(color) => {
                setHex(color.hex);
                setColorPick(color.hex);
            }}
        />
    );
};

export default ColorPickerBalls;