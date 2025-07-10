import { fetchAndSaveGroups } from './remote-service/group.service';
import { requestPost } from './remote-service/post.service';
import { LocalGroups, LocalPosts, LocalUser } from './local.service';

export const syncAllDataForCurrentUser = async () => {
  const currentUserRes = await LocalUser.getCurrentUser();
  if (!currentUserRes.success || !currentUserRes.user?.id) {
    return { success: false, error: 'Current user not found' };
  }

  const currentUserId = currentUserRes.user.id;

  // 1. Fetch and filter groups
  const groupResult = await fetchAndSaveGroups();
  if (!groupResult.success) {
    return { success: false, error: 'Failed to fetch groups' };
  }

  const allGroups = groupResult.groups || [];

  // Filter only groups where user is a member
  const userGroups = allGroups.filter(group =>
    Array.isArray(group.members) &&
    group.members.some(m => m === currentUserId || m?.id === currentUserId)
  );

  const savedGroupsRes = await LocalGroups.saveGroup(userGroups);

  // 2. Fetch and filter posts
  const postResult = await requestPost();
  if (!postResult.success) {
    return { success: false, error: 'Failed to fetch posts' };
  }

  const allPosts = postResult.posts || [];

  // Get group IDs user is part of
  const userGroupIds = new Set(userGroups.map(group => group.id));


  const userPosts = allPosts.filter(post =>
    post.userId === currentUserId || userGroupIds.has(post.groupId)
  );

  for (const post of userPosts) {
    await LocalPosts.savePost({
      id: post.id,
      user_id: post.userId,
      group_id: post.groupId,
      content: post.content,
      title: post.title,
      created_at: post.createdAt
    });
  }

  return {
    success: true,
    groupsSynced: userGroups.length,
    postsSynced: userPosts.length
  };
};
