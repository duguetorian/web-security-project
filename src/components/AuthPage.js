import React, { useState } from 'react'
import duck from '../ressources/dance-dancing-duck.gif';
import { Segment, Header, Grid, Form, Button } from 'semantic-ui-react';

function AuthPage() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    return (
        <div>
            <Segment compact style={{ maxWidth: '450px' }}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h2" >
                                <img src={duck} style={{ borderRadius: "100px", maxHeight: "200px", maxWidth: "200px", margin: "20px" }} alt="logo" />
                                Welcome to Ducking RSS
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign="left">
                            <Form size='large' widths='equal'>
                                <Form.Field>
                                    <label>Username</label>
                                    <input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Password</label>
                                    <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}/>
                                </Form.Field>
                                <Button type="submit" floated='right' onClick={(event, data) => console.log("username", username, "password", password)}>Log In</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    )
}

export default AuthPage;
