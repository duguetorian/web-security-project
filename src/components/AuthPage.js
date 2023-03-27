import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Segment, Header, Grid, Form, Button } from 'semantic-ui-react';
import useAuthContext from '../hooks/useAuthContext';
import { authenticate } from '../js/auth';
import duck from '../ressources/dance-dancing-duck.gif';

function AuthPage() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    let { setUser, setToken } = useAuthContext();
    const navigate = useNavigate();

    function handleSubmit(event) {
        authenticate(username, password, setUser, setToken)
        navigate('/logged', { replace: true });
    }

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
                            <Form size='large' widths='equal' onSubmit={handleSubmit}>
                                <Form.Field>
                                    <label>Username</label>
                                    <input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Password</label>
                                    <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
                                </Form.Field>
                                <Button type="submit" floated='right'>Log In</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    )
}

export default AuthPage;
