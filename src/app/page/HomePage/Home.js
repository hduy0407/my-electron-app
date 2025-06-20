import { useEffect, useState } from 'react';
import SideBar from './SideBar';
import { HomeContainer } from './style/HomeStyle';
import { ChatWindow } from './ChatWindow';

const Home = () => {
    const [data, setData] = useState(null);
    
    return (
        <HomeContainer>
            <SideBar />
            <ChatWindow />
        </HomeContainer>
    );
}

export default Home;