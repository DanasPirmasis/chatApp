import { Avatar } from '@material-ui/core';
import { useState, useEffect } from 'react';
import React from 'react';
import './SidebarChat.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function SidebarChat({addNewChat, userSearchHandler, inputUsername, setInputUsername, outputUsernames}) {

    const [modalOpen, setModalOpen] = useState(false);

    const createChat = () =>{

    };


    return !addNewChat ?(
        <div className="sidebarChat">
            <Avatar />
            <div className ="sidebarChat__info">
                <h3>Room name</h3>
                <p>Last message...</p>
            </div>
        </div>
    ): (
        <div onClick={createChat} className="sidebarChat">
            <h3 onClick={() => setModalOpen(true)}>Open new message</h3>
						<Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
							<h2>Find New Message</h2>
							<form onSubmit={userSearchHandler}>
								<input
									placeholder="Search users"
									value={inputUsername}
									onChange={(e) => setInputUsername(e.target.value)}
								/>
								<button type="submit">New Message</button>
							</form>

                                { outputUsernames >0 ? outputUsernames.map(outUser => (
                                    <li>{outUser}</li>,
                                    console.log(outUser)
			                    )): <li>{outputUsernames}</li>}
                            <br/>
							<button onClick={() => setModalOpen(false)}>Close</button>
						</Modal>
        </div>

    )
}

export default SidebarChat
