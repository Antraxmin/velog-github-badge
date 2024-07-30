export const GET_USER_POSTS = `
  query GetUserPosts($username: String!, $cursor: ID) {
    userPosts(username: $username, cursor: $cursor) {
      posts {
        id
        likes
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_POPULAR_TAGS = `
  query GetPopularTags($username: String!) {
    userTags(username: $username) {
      tags {
        name
        posts_count
      }
    }
  }
`;