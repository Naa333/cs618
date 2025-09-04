//import dependencies
import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'

//describe how post creation should be tested
describe('creating posts', () => {
  //#1 ideal case where all params are provided
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Connecting to Mongoose!',
      author: 'Lila Adams',
      contents: 'This is a post.',
      tags: ['mongoose', 'mongodb'],
    }
    //create and search for the post
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundPost = await Post.findById(createdPost._id)
    //all the following attributes should match!
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  //#2 corner case- failure
  test('without title should fail', async () => {
    const post = {
      author: 'John Doe',
      contents: 'Welcome to my blog',
      tags: ['empty'],
    }
    //error handling for the failed case
    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  //#3 corner case- success
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

//create sample posts to test
const samplePosts = [
  { title: 'Learning Redux', author: 'Naa Gyamfi', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Naa Gyamfi', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Naa Gyamfi',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

//delete all posts and add sample posts
let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

//describe tests to post listing
describe('listing posts', () => {
  //#1 testing that all the posts are returned
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })
  //#2 checking that it returns posts by the default sorting criteria
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  //#3 testing that defined sorting overrides the default
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })
  //#4 testing the filter function -1
  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
  })
  //#5 testing the filter function -2
  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})
