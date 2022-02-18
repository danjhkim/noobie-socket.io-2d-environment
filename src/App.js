import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Circle, Group, Text } from 'react-konva';
import './App.css';
import socket from './apis/socket.io';

function App() {
	const [isDragging, setIsDragging] = useState(false);
	const others = useRef();
	const myColor = useRef();
	const [peopletest, setPeopleTest] = useState();
	const [me, setMe] = useState('Me');

	useEffect(() => {
		socket.on('positions', data => {
			const index = data.findIndex(item => {
				return item.id === socket.id;
			});

			myColor.current = data[index].color;

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
				console.log(person.color);
				return (
					<Circle
						key={index}
						radius={40}
						id={person.id}
						x={person.x}
						y={person.y}
						width={50}
						height={50}
						fill={person.color}
						shadowBlur={5}
					/>
				);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [peopletest]);

	return (
		<div className='App'>
			<label for='initial'>Change Initials: </label>
			<input
				id='initial'
				type='text'
				onChange={e => setMe(e.target.value)}
				value={me}
				maxLength={2}
			/>
			<Stage width={window.innerWidth} height={window.innerHeight}>
				<Layer>
					{renderOthers()}
					<Group
						x={50}
						y={50}
						draggable
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
							socket.emit('people', {
								x: e.target.x(),
								y: e.target.y(),
								id: socket.id,
							});
						}}>
						<Circle
							radius={40}
							stroke={'1'}
							strokeWidth={isDragging ? 3 : 1}
							opacity={0.2}
							shadowBlur={isDragging ? 1 : 0}
							fill={myColor.current}
						/>
						<Text
							x={-22.5}
							y={-22.5}
							width={50}
							height={50}
							fontSize={20}
							text={me}
							stroke='#777'
							strokeWidth={1}
							align='center'
							verticalAlign='middle'
						/>
					</Group>
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
