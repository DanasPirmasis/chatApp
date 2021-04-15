import { Avatar } from '@material-ui/core'
import React from 'react'
import './Sidebar.css'
import SidebarChat from './SidebarChat'

function Sidebar({userSearchHandler, inputUsername, setInputUsername, outputUsernames}) {
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <h3>Welcome ustinas</h3>
            </div>


            <div className="sidebar__serch">
                {/* serchas */}
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat
                    userSearchHandler={userSearchHandler} 
                    inputUsername={inputUsername}
                    setInputUsername={setInputUsername}
                    outputUsernames={outputUsernames}
                    />

                <SidebarChat />
            </div>

            
        </div>
    )
}

export default Sidebar
