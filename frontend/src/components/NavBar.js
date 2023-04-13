import React, { useEffect, useRef, useState } from 'react';
import { Menu, Header, Dropdown, Accordion, List, Input } from 'semantic-ui-react';
import duck from '../ressources/dance-dancing-duck.gif';
import useAuthContext from '../hooks/useAuthToken';
import { disconnect } from '../js/auth';
import { addSource, getSources } from '../js/contentApi';


function NavBar({ children }) {

    const [activeItem, setActiveItem] = useState(null);
    const [sourceContent, setSourceContent] = useState([]);
    const [newSourceLink, setNewSourceLink] = useState("");
    const [newSourceError, setNewSourceError] = useState(false);

    const handleItemClick = (e, { name }) => {
        if (activeItem !== name) {
            setActiveItem(name);
            return
        }
        setActiveItem("");
    };

    const { authToken, setAuthToken } = useAuthContext();

    async function generateSourceContent(username, token) {
        setSourceContent(await getSources(username, token))
    }

    function handleNewSource() {
        const newSource = addSource(authToken.user, authToken.token, newSourceLink)
        if (!newSource) {
            setNewSourceError(true);
            return;
        }
        generateSourceContent(authToken.user, authToken.token);
        setNewSourceLink("");
        setActiveItem("source")
    }

    useEffect(() => {
        generateSourceContent(authToken.user, authToken.token)
    })

    const menuRef = useRef();
    const [menuWidth, setMenuWidth] = useState('20vw');
    useEffect(() => {
        if (menuRef.current) {
            setMenuWidth(menuRef.current.children[0].offsetWidth)
        }
    }, [menuWidth])

    return (
        <>
            <div style={{ position: 'fixed' }} ref={menuRef}>
                <Menu vertical fixed='left' inverted >
                    <Header as="h2" inverted>
                        <img src={duck} style={{ borderRadius: "100px", maxWidth: "200px", margin: "20px" }} alt="logo" />
                        <p>
                            Welcome {authToken.user} to Ducking RSS
                        </p>
                    </Header>
                    <Menu.Item>
                        <Header as="h3" inverted>
                            Home
                        </Header>
                        <Menu.Menu>
                            {/* <Menu.Item
                        name='communities'
                        onClick={handleItemClick}
                        active={activeItem === "communities"}
                        >
                        <Accordion inverted fluid>
                        <Accordion.Title
                        active={activeItem === "communities"}
                        index={0}
                        onClick={handleItemClick}>
                        Communities
                        </Accordion.Title>
                        <Accordion.Content>
                        test
                        </Accordion.Content>
                        </Accordion>
                    </Menu.Item> */}
                            <Menu.Item
                                name='source'
                            >
                                <Accordion inverted>
                                    <Accordion.Title
                                        name="source"
                                        onClick={handleItemClick}
                                    >
                                        Source
                                    </Accordion.Title>
                                    <Accordion.Content content={
                                        <List divided inverted >
                                            {sourceContent.map((content) => (
                                                <List.Item as="a" key={content.id}>{content.name}</List.Item>
                                            ))}
                                        </List>
                                    } active={activeItem === "source"}
                                        style={{ maxHeight: '40vh', overflowY: 'auto' }} />
                                </Accordion>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Header as="h3" inverted>
                            Browse
                        </Header>
                        <Menu.Menu>
                            {/* <Menu.Item
                        name='discover'
                        onClick={handleItemClick}
                        active={activeItem === "discover"}
                    /> */}
                            <Menu.Item
                                name='add'
                            >
                                <Accordion inverted>
                                    <Accordion.Title
                                        name="add"
                                        onClick={handleItemClick}
                                    >
                                        Add
                                    </Accordion.Title>
                                    <Accordion.Content
                                        active={activeItem === "add"}
                                    >
                                        <Input
                                            placeholder='http://my.rss.link.com'
                                            transparent
                                            inverted
                                            size='small'
                                            value={newSourceLink}
                                            onChange={({ target }) => setNewSourceLink(target.value)}
                                            action={{ icon: 'plus', onClick: handleNewSource, size: 'mini', inverted: true }}
                                        />
                                        <span>{newSourceError}</span>
                                        {newSourceError && <span style={{ color: 'red' }}>You must enter a valid url</span>}
                                    </Accordion.Content>
                                </Accordion>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Header as="h3" inverted>
                            Settings
                        </Header>
                        <Menu.Menu inverted>
                            <Menu.Item inverted>
                                <Dropdown text='Languages' options={[{ key: 1, text: 'English', value: 1 }]} />
                            </Menu.Item>
                            <Menu.Item
                                name='disconnect'
                                onClick={() => disconnect(setAuthToken)}
                                inverted>
                                <span style={{ color: 'red ' }}>Disconnect</span>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                </Menu>
            </div>
            <div style={{ marginLeft: menuWidth }}>
                {children}
            </div>
        </>
    )
}

export default NavBar;
