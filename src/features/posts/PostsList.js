import { useSelector } from "react-redux";
import {selectPostIds,getPostsError,getPostsStatus} from "./postSlice";
import PostExcerpts from "./PostExcerpts";

const PostsList = () => {
  const orderedPostsIds = useSelector(selectPostIds);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);
  
  let content;
  
  
  if (postsStatus === 'loading') {
    
    content = <p>"Loading.."</p>;
  
  } else if (postsStatus === 'succeeded') {
    content = orderedPostsIds.map(postId =><PostExcerpts key={postId} postId={postId} />);

  } else if (postsStatus === 'failed') {
    
    content = <p>{error}</p>;

  }

  return (
    <section>
      {content}
    </section>
  );
};

export default PostsList;
