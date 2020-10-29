import React, { useRef, useEffect, useState } from 'react';

export default ({ width = 600, height = 600, points = [], changePoints, curvePoints = [] }) => {
    const canvasRef = useRef();

    const [ctx, changeCtx] = useState(null);
    const [containerPosition, changePosition] = useState({ x: 0, y: 0 });

    function updateCanvas() {
        if (ctx) {
            // container
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            //drawing points
            ctx.fillStyle = '#ffffff';
            points.forEach(({ x, y }) => {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            });

            // drawing predicted curve
            ctx.strokeStyle = '#ffffff';
            curvePoints.forEach(({ x, y }, i, points) => {
                if (i+1 <= points.length-1){
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(points[i+1].x, points[i+1].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            });

        }
    }

    useEffect(() => {
        changeCtx(canvasRef.current.getContext('2d'));
    }, []);

    useEffect(() => {
        updateCanvas();
        const container = canvasRef.current;
        changePosition({ x: container.offsetLeft, y: container.offsetTop });
    }, [ctx, points, curvePoints]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={(e) => {
                changePoints([...points, {
                    x: e.clientX - containerPosition.x,
                    y: e.clientY - containerPosition.y
                }]);
            }}
        />
    )
}