import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeContainer } from './style/HomeStyle';
import SideBar from './SideBar';
import { ChatWindow } from './ChatWindow';
import { setSelectedConversation } from '../../redux/conversationSlice';
import { syncAllDataForCurrentUser } from '../../service/sync.service';

const Home = () => {
    const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render
    const dispatch = useDispatch();
    const selectedConversation = useSelector(
        (state) => state.conversation.selectedConversation
    );

    const handleSelectConversation = (conversation) => {
        dispatch(setSelectedConversation(conversation));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            syncAllDataForCurrentUser().then((res) => {
                if (res.success) {
                    setRefreshKey((prev) => prev + 1); //Force Sidebar to re-fetch from local DB
                }
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

  return (
    <HomeContainer>
      <SideBar onSelectedConversation={handleSelectConversation} refreshKey={refreshKey} />
      <ChatWindow refreshKey={refreshKey}
      onGroupNameChange={() => setRefreshKey(prev => prev + 1)}/>
    </HomeContainer>
  );
};

export default Home;
