import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useOnDraw } from '../hooks/DrawHook';

const Draw = ({ defaultWidth = 800, defaultHeight = 600 }) => {
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);
    const [isEraser, setIsEraser] = useState(false);
    const [title, setTitle] = useState('');
    const [drawings, setDrawings] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const onDraw = (ctx, point) => {
        ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    };

    const [canvasRef] = useOnDraw(onDraw);

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);

        const loadedDrawings = JSON.parse(localStorage.getItem('drawings')) || [];
        setDrawings(loadedDrawings);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const saveDrawing = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const newDrawing = { id: Date.now(), title, image: dataUrl };
        const updatedDrawings = [...drawings, newDrawing];
        setDrawings(updatedDrawings);
        localStorage.setItem('drawings', JSON.stringify(updatedDrawings));
        setTitle('');
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const selectPen = () => {
        setIsEraser(false);
    };

    const selectEraser = () => {
        setIsEraser(true);
    };

    const canvasWidth = Math.min(windowSize.width, defaultWidth);
    const canvasHeight = Math.min(windowSize.height, defaultHeight);

    return (
        <div className="Draw">
            <div style={{ padding: '10px', paddingTop: '100px' }}>
                <TextField
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="toolbar">
                <Button 
                    variant={!isEraser ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={selectPen}
                >
                    Pen
                </Button>
                <Button 
                    variant={isEraser ? 'contained' : 'outlined'}
                    color="error"
                    onClick={selectEraser}
                >
                    Eraser
                </Button>
                <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)} 
                    disabled={isEraser}
                />
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={lineWidth} 
                    onChange={(e) => setLineWidth(e.target.value)} 
                />
                <Button 
                    onClick={saveDrawing}
                    color="success"
                    variant="contained"
                >
                    Save
                </Button>
                <Button 
                    onClick={clearCanvas}
                    color="warning"
                    variant="contained"
                >
                    Clear
                </Button>
            </div>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{ border: '1px solid black', background: 'white' }}
            />
        </div>
    );
};

export default Draw;
