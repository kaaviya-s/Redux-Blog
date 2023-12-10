import React, { useState } from 'react'
import { selectAllUsers } from '../users/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectPostById ,updatePost,deletePost} from './postSlice'
import {  useNavigate, useParams } from 'react-router-dom'

const EditPostForm = () => {
    const {postId}=useParams()
    const post = useSelector((state) => selectPostById(state,Number(postId)));
    const users =useSelector(selectAllUsers);
    
    const [title,setTitle] = useState(post?.title);
    const [content,setContent] = useState(post?.body);
    const [userId,setUserId] = useState(post?.userId);
    const [requestStatus,setRequestStatus]= useState('idle');

    const navigate = useNavigate();

    const dispatch = useDispatch();

    if(!post){
        return (
            <section>
                <h2>Post Not Found!</h2>
            </section>
        )
    }
    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const canSave = [title,content,userId].every(Boolean) && requestStatus === 'idle';
    const userOptions = users.map( user => (
        <option key={user.id} value ={user.id}>{user.name}</option>
    ))
    const onSavePostClicked  = () =>{
        if(canSave){
            try{
                setRequestStatus('pending');
                
                dispatch(updatePost({id:post.id , title, body:content,userId ,
                reactions : post.reactions})).unwrap();
                
                navigate(`/post/${postId}`);
                setTitle('');
                setContent('');
                setUserId('');
            }
            catch(err){
                console.error("Failed to save post",err);
            }
            finally{
                setRequestStatus('idle');
            }
        }
          
      }

      const onDeletePostClicked  = () =>{
        if(canSave){
            try{
                setRequestStatus('pending');
                
                dispatch(deletePost({id:post.id})).unwrap();
                
                setTitle('');
                setContent('');
                setUserId('');
                navigate("/");
            }
            catch(err){
                console.error("Failed to save post",err);
            }
            finally{
                setRequestStatus('idle');
            }
        }
          
      }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title: </label>
                <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged} />

                <label htmlFor="postAuthor">Post Author: </label>
                <select id="postAuthor" value={userId}
                onChange={onAuthorChanged}>
                    <option value=""></option>
                    {userOptions}
                </select>

                <label htmlFor='postContent'>Content:</label>
                <textarea
                    id="postContent"
                    value={content}
                    onChange={onContentChanged}
                    name="postContent"
                ></textarea>

                <button
                    style={{backgroundColor : (!canSave) ? 'white' : 'purple' , color: (!canSave) ? 'lightgray' : 'whiteSmoke'}}
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>

                <button
                    style={{backgroundColor : "purple", color:"whitesmoke"}}
                    className='deletePost'
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    )
}

export default EditPostForm