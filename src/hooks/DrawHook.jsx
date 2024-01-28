import { useEffect, useRef } from "react";

export function useOnDraw(onDraw) {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseDown = (e) => {
            isDrawingRef.current = true;
            const point = getPoint(e.clientX, e.clientY);
            lastPointRef.current = point;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        };

        const handleMouseMove = (e) => {
            if (isDrawingRef.current) {
                const point = getPoint(e.clientX, e.clientY);
                if (lastPointRef.current) {
                    onDraw(canvas.getContext('2d'), point);
                    lastPointRef.current = point;
                }
            }
        };

        const handleMouseUp = () => {
            isDrawingRef.current = false;
            lastPointRef.current = null;
            canvas.getContext('2d').beginPath();
        };

        const getPoint = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onDraw]);

    return [canvasRef];
}
