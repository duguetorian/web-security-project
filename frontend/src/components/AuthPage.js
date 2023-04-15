import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Segment, Header, Grid, Form, Button, Modal } from 'semantic-ui-react';
import useAuthToken from '../hooks/useAuthToken';
import { authenticate, createUser } from '../js/auth';
import duck from '../ressources/dance-dancing-duck.gif';

const linkButtonStyle = {
    background: "none",
    border: "none",
    padding: "0 5px",
    fontFamily: "arial, sans-serif",
    color: "#069",
    textDecoration: "underline",
    cursor: "pointer",
}


function AuthPage() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    let [signup, setSignUp] = useState(false);
    let [newUsername, setNewUsername] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [confPassword, setConfPassword] = useState("");
    let [userAlreadyExists, setUserAlreadyExists] = useState(false);
    let [randomError, setRandomError] = useState(false);

    let [failedAuth, setFailedAuth] = useState(false);

    let { setAuthToken } = useAuthToken();
    const navigate = useNavigate();

    async function handleSubmitAuth() {
        if (await authenticate(username, password, setAuthToken)) {
            navigate('/home', { replace: true });
            return;
        }
        setFailedAuth(true);
    }

    async function handleSubmitSignUp() {
        const response = await createUser(newUsername, newPassword);
        if (response === 'ok') {
            handleCLoseModale();
            return;
        }
        if (response === 'error') {
            setRandomError(true)
            return;
        }
        setUserAlreadyExists(true)
        return;
    }

    function disableSignUp() {
        if (checkIfPasswordConfirmed() && newUsername !== "") {
            return false;
        }
        return true;
    }

    function handleCLoseModale() {
        setNewPassword("");
        setNewUsername("");
        setConfPassword("");
        setSignUp(false);
    }

    function checkIfPasswordConfirmed() {
        if (newPassword === confPassword && confPassword !== "") {
            return true;
        }
        return false;
    }

    return (
        <>
            <Segment compact style={{ maxWidth: '450px' }} raised>
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
                            <Form size='large' widths='equal' onSubmit={async () => await handleSubmitAuth()}>
                                <Form.Field>
                                    <label>Username</label>
                                    <input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Password</label>
                                    <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
                                </Form.Field>
                                {failedAuth && <span style={{ color: 'red' }}>Wrong username or wrong password</span>}
                                <Button type="submit" floated='right'>Log In</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            You don't have an account ? 
                            <Modal
                                onCLose={() => setSignUp(false)}
                                onOpen={() => setSignUp(true)}
                                open={signup}
                                trigger={<button style={linkButtonStyle} onClick={() => setSignUp(true)} href=''> Sign Up</button>}
                            >
                                <Modal.Header>Sign Up</Modal.Header>
                                <Modal.Content>
                                    <Form widths='equal'>
                                        <Form.Field>
                                            <label>Username</label>
                                            <input placeholder="Username" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Password</label>
                                            <input type="password" placeholder='Password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Confirm Password</label>
                                            <input type="password" placeholder='Confirm Password' value={confPassword} onChange={(event) => setConfPassword(event.target.value)} />
                                            {!checkIfPasswordConfirmed() && <span style={{ color: 'red', textDecoration: 'underline', textDecorationColor: 'red' }}>You must write the same password</span>}
                                            {userAlreadyExists && <span style={{ color: 'red' }}>User already exists</span>}
                                            {randomError && <span style={{ color: 'red' }}>An error as occured</span>}
                                        </Form.Field>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button positive disabled={disableSignUp()} onClick={async () => await handleSubmitSignUp()}>Sign Up</Button>
                                    <Button negative onClick={handleCLoseModale}>Cancel</Button>
                                </Modal.Actions>
                            </Modal>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </>
    )
}

export default AuthPage;
