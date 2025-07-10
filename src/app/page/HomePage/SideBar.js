import { Avatar, Typography, TextField, Box, ListItemText, Button, Drawer } from "@mui/material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { SidebarStyle, SearchBarStyle, ConversationListStyle, ConversationItemStyle, ListItem, BoxList } from "./style/SidebarStyle";
import { UserBoxStyle } from "./style/SidebarStyle";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Collapse, List } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DrawerProfile } from "./DrawerProfile";
import { ChatList } from "./ChatList";
import { LocalUser } from "../../service/local.service";
import { getGroups } from "../../service/remote-service/group.service";

const baseUrl = process.env.REACT_APP_API_URL;

const SideBar = () => {
    const [conversations, setConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [searchConversation, setSearchConversation] = useState('');
    const [user, setUser] = useState({
        username: '',
        avatar: ''
    });

    const handleClick = () => {
        setOpen(!open);
    };

    const toggleDrawer = (newOpen) => () => {
        setOpenDrawer(newOpen);
    };

    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    
        const filtered = conversations.filter(conversation =>
            conversation.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchConversation(filtered);
    };

    useEffect(() => {
        getGroups(setConversations, setSearchConversation);
    }, []);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("No token found, redirecting to login");
            navigate('/');
            return;
        }
        const fetchLocalUser = async () => {
            try {
                const user = await LocalUser.getCurrentUser();
                console.log("Local user from DB:", user);

                if (user) {
                    setUser(user);
                } else {
                    console.warn("No local user found in database.");
                }
            } catch (err) {
                console.error("Error fetching local user:", err);
            }
        };

        fetchLocalUser();
    }, []);

    return (
        <SidebarStyle>
            <UserBoxStyle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} onClick={toggleDrawer(true)}>
                    <Avatar src={user.avatar}/>
                    <Typography variant="subtitle1">
                        {user.username}
                    </Typography>
                </Box>
                <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
                    <DrawerProfile toggleDrawer={toggleDrawer} user={{
                        avatar: user.avatar,
                        name: user.username
                    }}/>
                </Drawer>
                <NotificationsNoneIcon />
            </UserBoxStyle>
            

            <SearchBarStyle>
                <TextField 
                    fullWidth
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="outlined"
                    size="small"
                />
            </SearchBarStyle>

            <BoxList>
                <ListItem onClick={handleClick} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                    <ListItemText primary="Nhóm" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Button>
                    <AddIcon />
                </Button>
            </BoxList>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ConversationListStyle>
                        <ChatList conversations={
                            searchTerm.trim()
                            ? searchConversation
                            : conversations
                        } 
                        />
                    </ConversationListStyle>
                </List>
            </Collapse>
        </SidebarStyle>
    );
}

export default SideBar;