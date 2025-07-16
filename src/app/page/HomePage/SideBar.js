import {
  Avatar,
  Typography,
  TextField,
  Box,
  ListItemText,
  Button,
  Drawer,
  Collapse,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import {
  SidebarStyle,
  SearchBarStyle,
  ConversationListStyle,
  ListItemStyle,
  BoxList,
  UserBoxStyle,
  ConversationListWrapper
} from './style/SidebarStyle';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DrawerProfile } from './DrawerProfile';
import { ChatList } from './ChatList';
import { CreateGroupDrawer } from './CreateGroup';
import { LocalUser, LocalGroups, LocalPosts } from '../../service/local.service';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const SideBar = ({ onSelectedConversation, refreshKey = 0, onGroupCreated }) => {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerGroup, setOpenDrawerGroup] = useState(false);
  const [user, setUser] = useState({ username: '', avatar: '' });
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const navigate = useNavigate();

  const toggleDrawer = (setter) => (open) => () => setter(open);
  const handleClick = () => setOpen(!open);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = conversations.filter((c) =>
      c.name?.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversationId(conversation?.id || null);
    if (typeof onSelectedConversation === 'function') {
      onSelectedConversation(conversation);
    }
  };

  const handleGroupCreated = async (newGroup) => {
    if (typeof onGroupCreated === 'function') {
      await onGroupCreated(newGroup);
    }

    const waitForGroupInLocalDB = async (groupId, retries = 10, delay = 100) => {
      for (let i = 0; i < retries; i++) {
        const post = await LocalPosts.getLatestMessageByGroupId(groupId);
        if (post?.latestMessage) return true;
        await new Promise((r) => setTimeout(r, delay));
      }
      return false;
    };

    await waitForGroupInLocalDB(newGroup.id);

    const enriched = {
      ...newGroup,
      lastMessage: 'No messages yet',
      lastMessageTime: new Date().toISOString(),
    };

    setSelectedConversationId(null);
    setTimeout(() => {
      setSelectedConversationId(enriched.id);
      handleConversationSelect(enriched);
    }, 0);

    setOpenDrawerGroup(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    const fetchData = async () => {
      const resUser = await LocalUser.getCurrentUser();
      if (resUser?.success && resUser.user) {
        setUser({
          id: resUser.user.id,
          username: resUser.user.username,
          fullName: resUser.user.full_name,
          email: resUser.user.email,
          gender: resUser.user.gender,
          dateOfBirth: resUser.user.date_of_birth,
        });
      }

      const resGroups = await LocalGroups.getGroups();
      if (resGroups?.success) {
        const groups = resGroups.groups || [];

        const enriched = await Promise.all(
          groups.map(async (group) => {
            const latest = await LocalPosts.getLatestMessageByGroupId(group.id);
            const latestMessage = latest?.latestMessage;

            return {
              ...group,
              lastMessage: latestMessage?.content || 'No messages yet',
              lastMessageTime: latestMessage?.created_at || '',
              lastMessageUserId: latestMessage?.user_id || '',
              lastMessageUsername: latestMessage?.username || '',
            };
          })
        );

        enriched.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        setConversations(enriched);
        setSearchResults(enriched);
      }
    };

    fetchData();
  }, [navigate, refreshKey]);

  return (
    <SidebarStyle>
      <UserBoxStyle>
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          onClick={toggleDrawer(setOpenDrawer)(true)}
        >
          <Avatar src={user.avatar} alt={user.username}>
            {!user.avatar && user.username
              ? user.username.charAt(0).toUpperCase()
              : null}
          </Avatar>
          <Typography>{user.username}</Typography>
        </Box>
        <Drawer
          open={openDrawer}
          onClose={toggleDrawer(setOpenDrawer)(false)}
          ModalProps={{ hideBackdrop: true }}
        >
          <DrawerProfile user={user} toggleDrawer={toggleDrawer(setOpenDrawer)} />
        </Drawer>
      </UserBoxStyle>

      <SearchBarStyle>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchBarStyle>

      <BoxList>
        <ListItemStyle onClick={handleClick}>
          <ListItemText primary="Nhóm" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemStyle>
        <Button onClick={toggleDrawer(setOpenDrawerGroup)(true)}>
          <AddIcon />
        </Button>
        <Drawer
          open={openDrawerGroup}
          onClose={toggleDrawer(setOpenDrawerGroup)(false)}
          ModalProps={{ hideBackdrop: true }}
        >
          <CreateGroupDrawer
            toggleDrawer={toggleDrawer(setOpenDrawerGroup)}
            onGroupCreated={handleGroupCreated}
          />
        </Drawer>
      </BoxList>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Collapse in={open} timeout={300} unmountOnExit orientation="vertical" />
        {open && (
          <ConversationListWrapper className={!open ? 'collapsed' : ''}>
            <ConversationListStyle>
              <ChatList
                conversations={searchTerm.trim() ? searchResults : conversations}
                onSelect={handleConversationSelect}
                currentUserId={user.id}
                selectedConversationId={selectedConversationId}
              />
            </ConversationListStyle>
          </ConversationListWrapper>
        )}
      </Box>
    </SidebarStyle>
  );
};

export default SideBar;
