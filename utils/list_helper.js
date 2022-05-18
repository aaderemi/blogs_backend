const _ = require('lodash')
const dummy = (blogs)=>{
    return 1
}

const totalLikes = (blogs)=>{
    if(blogs.length===0){
        return 0
    }
    const likesSum = blogs.reduce((prev, blog)=>{
        return blog.likes + prev
    }, 0)
    return likesSum
}

const favoriteBlog = (blogs)=>{
    const favBlog = blogs.reduce((prev, blog)=>{
        if(!prev){
            prev = blog
            //console.log('prev and blog ', prev, blog)
        }
        //console.log('prev', prev)
        return (blog.likes>=prev.likes) ? blog:prev
    }, null)
    return favBlog
}

const mostBlogs = (blogs)=>{
    const blogAuth = {}

    for(let blog of blogs){
        const author = blog.author
        const authorExists = Object.keys(blogAuth).find(
            (e)=>{
                return e===author
            }
        )
        if(authorExists){
            blogAuth[author] += 1
        }else{
            blogAuth[author] = 1
        }
    }
    
    const maxArticles = Math.max(...Object.values(blogAuth))
    const maxArticlesAuth = _.findKey(blogAuth, (v)=>v===maxArticles)

    return {
        [maxArticlesAuth]:maxArticles
    }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}