import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeContainer } from './style/HomeStyle';
import SideBar from './SideBar';
import { ChatWindow } from './ChatWindow';
import { setSelectedConversation, clearSelectedConversation } from '../../redux/conversationSlice';
import { syncAllDataForCurrentUser } from '../../service/sync.service';

const Home = () => {
  const [chatRefreshKey, setChatRefreshKey] = useState(0);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
  };

  const handleGroupCreated = (newGroup) => {
    setSidebarRefreshKey((prev) => prev + 1);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      syncAllDataForCurrentUser();
      setChatRefreshKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HomeContainer>
      <SideBar
        onSelectedConversation={handleSelectConversation}
        refreshKey={sidebarRefreshKey}
        onGroupCreated={handleGroupCreated}
      />
      <ChatWindow
        refreshKey={chatRefreshKey}
        onGroupNameChange={handleGroupCreated}
        onGroupUpdated={() => setSidebarRefreshKey((prev) => prev + 1)}
      />
    </HomeContainer>
  );
};

export default Home;
