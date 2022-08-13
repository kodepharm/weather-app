import axios from 'axios';
import { useState, useEffect } from "react"



export default function Homer() {
  const [posts, setPosts] = useState([]);
  // const apiEndPoint = 'https://jsonplaceholder.typicode.com/posts'
  const apiEndPoint = 'http://127.0.0.1:3333/posts'
  useEffect(()=>{
    const getPosts = async () =>{
      const {data: res} = await axios.get(apiEndPoint)
      setPosts(res);
    };
    getPosts();
  }, []);

  const addPost = async () => {
    const post = {title: 'New Post', body: 'new body post'}
    await axios.post(apiEndPoint, post)
    setPosts([post, ...posts])
  }

  return (
    <div>
    <h1>Home Page</h1>
    <h2>there are this {posts.length} post in this table</h2>
    <button onClick={addPost} className='btn btn-primary'>Add New Post</button>
    <table className='table'>
      <thead>
        <tr>
          <th>Title</th>
          <th>Body</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(post =>
          <tr key={post.id}>
            <td> {post.title}</td>
            <td> {post.body}</td>
            <td>
              <button className='btn btn-info btn-sm'>update</button>
              </td>
            <td>
              <button className='btn btn-danger btn-sm'>delete</button>
              </td>
          </tr>
          )}
      </tbody>
    </table>
    </div>
  )

}
