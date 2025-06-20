const baseUrl = process.env.REACT_PUBLIC_API_URL;


export const getGroups = async (setConversations, setSearchConversation) => {
    try {
        const response = await fetch(baseUrl + '/api/groups', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = await response.json();
        if (response.ok && result?.data?.groups) {
            const groups = result.data.groups.map(group => ({
                id: group.id,
                name: group.name,
                avatar: group.thumbnail || undefined
            }));
            setConversations(groups);
            setSearchConversation(groups);
        } else {
            console.error('Failed to fetch groups:', result.message);
        }
    } catch (err) {
        console.error('Error fetching groups:', err);
    }
};