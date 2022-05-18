const app = require('../app')
const Blog = require('../models/blog')
const supertest = require('supertest')
const mongoose = require('mongoose')

const api = supertest(app)

const blogs = [
    {
        title: "TFIOS fanfic",
        author: "adeola",
        url: "http://random.url/tfios",
        likes: 1000
    },
    {
        title: "fun.: the return",
        author: "adeola",
        url: "http://random.url/fun-returns",
        likes: 100
    }
]

beforeEach(
    async ()=>{
        await Blog.deleteMany({})
        const blog1 = new Blog(blogs[0])
        await blog1.save()
        const blog2 = new Blog(blogs[1])
        await blog2.save()
    }
, 10000)

test('verifies number of blogs and data type', async ()=>{
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    console.log(response.body.length, blogs.length)
    expect(response.body.length).toBe(blogs.length)
})

test('ID is defined', async ()=>{
    const response = await api.get('/api/blogs')
    
    expect(response.body[0].id).toBeDefined()
})

test('Can post a blog', async ()=>{
    const newBlog = {
        title: "The story of: Adeola",
        author: "deola",
        url: "random.url/story-of-adeola",
        likes: 10000
    }
    await api.post('/api/blogs').send(newBlog)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length + 1)

    const blogTitles = response.body.map(r=>r.title)
    expect(blogTitles).toContain("The story of: Adeola")
})

test('Can post a blog with no likes', async ()=>{
    const newBlog = {
        title: "The story of: Adeola",
        author: "deola",
        url: "random.url/story-of-adeola"
    }
    const newPost = await api.post('/api/blogs').send(newBlog)
    expect(newPost.body.likes).toBe(0)
})

test('can delete blog by id', async ()=>{
    const response = await api.get('/api/blogs')
    const blogToBeDeleted = response.body[0]

    console.log(blogToBeDeleted.id)

    await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(204)

    const responseAfterDel = await api.get('/api/blogs')
    expect(responseAfterDel.body).toHaveLength(blogs.length-1)
})

test('can modify number of likes', async ()=>{
    const response = await api.get('/api/blogs')
    const blogToBeMod = response.body[0]

    console.log(blogToBeMod.id)
    const updated = await api.put(`/api/blogs/${blogToBeMod.id}`).send({likes:10})
    expect(updated.body.likes).toBe(10)
})

afterAll(
    ()=>{
        mongoose.connection.close()
    }
)