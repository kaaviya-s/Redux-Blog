// import React from "react";
// import PostAuthor from "./PostAuthor";
// import ReactionButton from "./ReactionButton";
// import TimeAgo from "./TimeAgo";
// import {Link} from 'react-router-dom';

// let PostExcerpts = ({ post }) => {
//   return (
//     <article>
//       <h3>{post.title}</h3>

//       <p className="excerpt">{post.body.substring(0,75)}...</p>

//       <div className="postCredit">
//         <Link to={`post/${post.id}`} >View Post</Link>
//         <PostAuthor userId={post.userId} />
//         <TimeAgo timestamp={post.date} />
//         <ReactionButton post={post} />
//       </div>
      
//     </article>
//   );
// };

// //To render only the post that had updated 
// PostExcerpts = React.memo(PostExcerpts);

// export default PostExcerpts;


//Using Normalization to reduce re-rendering
import PostAuthor from "./PostAuthor";
import ReactionButton from "./ReactionButton";
import TimeAgo from "./TimeAgo";
import {Link} from 'react-router-dom';

const PostExcerpts = ({ post }) => {
  return (
    <article>
      <h3>{post.title}</h3>

      <p className="excerpt">{post.body.substring(0,75)}...</p>

      <div className="postCredit">
        <Link to={`post/${post.id}`} >View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
        <ReactionButton post={post} />
      </div>
      
    </article>
  );
};


export default PostExcerpts;
