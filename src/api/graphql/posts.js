import { gql } from '@apollo/client/core/index.js'
export const GET_POSTS = gql`
  query getPosts($options: PostsOptions) {
    posts(options: $options) {
      author {
        username
      }
      id
      title
      contents
      tags
      updatedAt
      createdAt
    }
  }
`
