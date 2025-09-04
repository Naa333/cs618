import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'
await initDatabase()
const post = new Post({
  title: 'Hello Mongoose!',
  author: 'Naa Gyamfi',
  contents: 'Connecting to the database using Mongoose',
  tags: ['mongoose', 'mongodb'],
})
await post.save()
const posts = await Post.find()
console.log(posts)
