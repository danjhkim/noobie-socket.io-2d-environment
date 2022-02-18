import React, { useState, useEffect, useMemo, useRef } from 'react';

import { Stage, Layer, Circle, Rect } from 'react-konva';
import './App.css';
import socket from './apis/socket.io';
const randomColor = require('randomcolor'); // import the script

function App() {
	const [isDragging, setIsDragging] = useState(false);
	const [myCircle, setMyCircle] = useState({ x: 50, y: 50 });
	const others = useRef();

	socket.on('connection', data => {});

	socket.on('positions', data => {
		const newListWithoutYou = data.filter(item => {
			return item.id !== myCircle.id;
		});
		others.current = newListWithoutYou;
	});

	const renderOthers = () => {
		console.log(others);
		if (Array.isArray(others.current)) {
			return others.current.map((person, index) => {
				console.log(person);
				return (
					<Rect
						key={index}
						id={person.id}
						x={person.x}
						y={person.y}
						width={50}
						height={50}
						fill={randomColor()}
						shadowBlur={5}
					/>
				);
			});

			//for (let i of array) {
			// 	return (
			// 		<Rect
			// 			id={i.id}
			// 			x={20}
			// 			y={20}
			// 			width={50}
			// 			height={50}
			// 			fill='red'
			// 			shadowBlur={5}
			// 		/>
			// 	);
			// }
		}
	};

	return (
		<div className='App'>
			<Stage width={window.innerWidth} height={window.innerHeight}>
				<Layer>
					{renderOthers()}
					<Circle
						radius={40}
						text='Draggable Text'
						x={myCircle.x}
						y={myCircle.y}
						draggable
						fill={isDragging ? 'green' : 'black'}
						onDragStart={() => {
							setIsDragging(true);
						}}
						onMouseEnter={e => {
							const container = e.target.getStage().container();
							container.style.cursor = 'pointer';
						}}
						onMouseLeave={e => {
							const container = e.target.getStage().container();
							container.style.cursor = 'default';
						}}
						onDragEnd={e => {
							setIsDragging(false);
							setMyCircle({
								x: e.target.x(),
								y: e.target.y(),
								id: socket.id,
							});

							socket.emit('people', {
								x: e.target.x(),
								y: e.target.y(),
								id: socket.id,
							});
						}}
					/>
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
