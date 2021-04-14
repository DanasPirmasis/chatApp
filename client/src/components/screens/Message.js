import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './Message.css';

function Message(props) {
    //const isUser = username === message.username
    return (
        <div>
            <Card className ={`message'`}>
                <CardContent>
                    <Typography
                    color= 'secondary'
                    varinat= 'h5'
                    component ='h2'
                    >
                        {props.username} {props.text}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default Message
