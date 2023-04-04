import React, { useState } from 'react';
import { Menu, Header, Dropdown } from 'semantic-ui-react';
import duck from '../ressources/dance-dancing-duck.gif';
import useAuthContext from '../hooks/useAuthContext';
import { disconnect } from '../js/auth';

function NavBar() {
    let [activeItem, setActiveItem] = useState(null)
    const handleItemClick = (e, { name }) => setActiveItem(name);

    let { setUser, setToken } = useAuthContext();

    return (
        <Menu vertical fixed='left' inverted>
            <Header as="h2" inverted>
                <img src={duck} style={{ borderRadius: "100px", maxWidth: "200px", margin: "20px" }} alt="logo" />
                <p>
                    Ducking RSS
                </p>
            </Header>
            {/* <Menu.Item>
                <Input icon='search' placeholder='Search...' />
            </Menu.Item> */}
            <Menu.Item>
                <Header as="h3" inverted>
                    Home
                </Header>
                <Menu.Menu>
                    <Menu.Item
                        name='communities'
                        onClick={handleItemClick}
                        active={activeItem === "communities"}
                    />
                    <Menu.Item
                        name='content'
                        onClick={handleItemClick}
                        active={activeItem === "content"}
                    />
                </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
                <Header as="h3" inverted>
                    Browse
                </Header>
                <Menu.Menu>
                    <Menu.Item
                        name='discover'
                        onClick={handleItemClick}
                        active={activeItem === "discover"}
                    />
                    <Menu.Item
                        name='add'
                        onClick={handleItemClick}
                        active={activeItem === "add"}
                    />
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
                        onClick={() => disconnect(setUser, setToken)}
                        inverted>
                        <span style={{ color: 'red ' }}>Disconnect</span>
                    </Menu.Item>
                </Menu.Menu>
            </Menu.Item>
        </Menu>
    )
}

export default NavBar;
