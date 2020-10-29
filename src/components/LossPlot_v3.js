import React from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

export default ({ width = 400, height = 430, loss = [] }) => {
    return (
        <LineChart
            width={width}
            height={height}
            margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
            data={loss}>
            <XAxis dataKey="epoch"/>
            <YAxis/>
            <CartesianGrid

            />
            <Line
                type="monotone"
                dataKey="loss"
                stroke="#8884d8"
                dot={false}/>
        </LineChart>
    )
}