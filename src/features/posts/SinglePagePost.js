import React from 'react';
import {useSelector} from 'react-redux';
import {selectPostById} from './postSlice';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButton from './ReactionButton';
import { Link, useParams } from 'react-router-dom';


const SinglePagePost = () => {
  const {postId} = useParams()
  const post = useSelector((state) => selectPostById(state,Number(postId)))
  console.log(post);
  if(!post){
    return (
      <section>
        <h2>Post Not Found!</h2>
      </section>
    )
  }

  return (
    <article>
      <h3>{post.title}</h3>

      <p>{post.body}</p>

      <div className="postCredit">
        <Link to={`/post/edit/${post.id}`} >Edit Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
        <ReactionButton post={post} />
      </div>
      
    </article>
  )
}

export default SinglePagePost