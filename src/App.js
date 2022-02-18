import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Stage, Layer, Circle } from 'react-konva';
import './App.css';
import socket from './apis/socket.io';
import useImage from 'use-image';
import Me from './images/Me.png';

const randomColor = require('randomcolor'); // import the script

function App() {
	const [isDragging, setIsDragging] = useState(false);
	const others = useRef();
	const [image] = useImage('./images/Me.png');
	const [peopletest, setPeopleTest] = useState();

	useEffect(() => {
		socket.on('positions', data => {
			console.log('once per movement');
			const newListWithoutYou = data.filter(item => {
				return item.id !== socket.id;
			});
			others.current = newListWithoutYou;
			setPeopleTest(newListWithoutYou);
		});
	}, []);

	const renderOthers = useCallback(() => {
		if (Array.isArray(others.current)) {
			return others.current.map((person, index) => {
				return (
					<Circle
						key={index}
						radius={40}
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [peopletest]);

	return (
		<div className='App'>
			<Stage width={window.innerWidth} height={window.innerHeight}>
				<Layer>
					{renderOthers()}
					<>
						<Circle
							radius={40}
							x={50}
							y={50}
							draggable
							fillPatternImage={image}
							fillPatternRepeat={'no-repeat'}
							stroke={'1'}
							strokeWidth={isDragging ? 3 : 1}
							opacity={0.2}
							shadowBlur={isDragging ? 0 : 1}
							onDragStart={() => {
								setIsDragging(true);
							}}
							onMouseEnter={e => {
								const container = e.target
									.getStage()
									.container();
								container.style.cursor = 'pointer';
							}}
							onMouseLeave={e => {
								const container = e.target
									.getStage()
									.container();
								container.style.cursor = 'default';
							}}
							onDragEnd={e => {
								setIsDragging(false);
								socket.emit('people', {
									x: e.target.x(),
									y: e.target.y(),
									id: socket.id,
								});
							}}
						/>
					</>
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
