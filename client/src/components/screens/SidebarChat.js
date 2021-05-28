import { Avatar } from '@material-ui/core';
import { useState } from 'react';
import React from 'react';
import './SidebarChat.css';
import uuid from 'react-uuid';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function SidebarChat({
	addNewChat,
	userSearchHandler,
	inputUsername,
	setInputUsername,
	outputUsernames,
	userSelect,
	setuserSelect,
	findId,
	usernameState,
	newConversationHandler
}) {
	const [modalOpen, setModalOpen] = useState(false);

	const createChat = (e) => {};

	const handleCheckbox = (el, inx) => {
		if (userSelect[0].name === undefined){
			setuserSelect([{name:el, id:findId[inx], index:inx}])
		}else{
			setuserSelect(userSelect =>[...userSelect,{name:el, id:findId[inx], index:inx}])
		}
		
		console.log(userSelect)
	};

	const deleteUser =(e, id) =>{
		e.preventDefault();
		setuserSelect(userSelect.filter((t) => t.index !==id));
	};
	

	return !addNewChat ? (
		userSelect.name !== '' ? (
			<div className="sidebarChat">
				<Avatar />
				<div className="sidebarChat__info">
					<h3>Room with {userSelect.name}</h3>
					<p>Last message...</p>
				</div>
			</div>
		) : (
			<></>
		)
	) : (
		<div onClick={createChat} className="sidebarChat">
			<h3 onClick={() => setModalOpen(true)}>Open new message</h3>
			<Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
			<div className="userSelect__box">
				<h2>Find New Message</h2>
				<form onSubmit={userSearchHandler}>
					<input
						placeholder="Search users"
						value={inputUsername}
						onChange={(e) => setInputUsername(e.target.value)}
					/>
					<button type="submit">New Message</button>
				</form>

				

				{outputUsernames.map((el, inx) => (
					el.name === usernameState ? (null):(
					<div
						className="user__names"
						key={el}
					>
						<li onClick={ (e) =>handleCheckbox(el, inx)} >{el}</li>
					</div>
				)))}
				
				<button onClick={() => setModalOpen(false)}>Close</button>
				<br ></br>
				<br />
			</div>
				{userSelect !== {} ? (userSelect.map((element) =>(
					//console.log(element),
					<div className="showSelected">
						<p>{element.index}: {element.name}</p>
						<button onClick={(e) =>deleteUser(e, element.index)}>X</button>
					</div>
					
				))):null }
				<button onClick={(e) =>newConversationHandler(e, userSelect)}>newConversationHandler</button>
			</Modal>
		</div>
	);
}

export default SidebarChat;
