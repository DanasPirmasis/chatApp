import { Avatar } from '@material-ui/core'
import React from 'react'
import './Sidebar.css'
import SidebarChat from './SidebarChat'
import { useState, useEffect } from 'react';

function Sidebar({userSearchHandler, inputUsername, setInputUsername, outputUsernames,usernameState}) {

    const [userSelect, setuserSelect] = useState('');

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <h3>Welcome {usernameState}</h3>
            </div>


            <div className="sidebar__serch">
                {/* serchas */}
            </div>

            <div className="sidebar__chats">
                <SidebarChat 
                    addNewChat
                    userSearchHandler={userSearchHandler} 
                    inputUsername={inputUsername}
                    setInputUsername={setInputUsername}
                    outputUsernames={outputUsernames}
                    setuserSelect={setuserSelect}
                    userSelect={userSelect}
                    />

                <SidebarChat 
                userSelect= {userSelect}/>
                
            </div>

            
        </div>
    )
}

export default Sidebar
