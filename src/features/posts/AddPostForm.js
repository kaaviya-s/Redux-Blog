import { useState } from "react";
import React from 'react';
import { useDispatch, useSelector} from "react-redux";
import { addNewPost } from "./postSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title,setTitle]=useState('');
  const [content,setContent] = useState('');
  const [userId,setUserId] = useState('');
  const users = useSelector(selectAllUsers);
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const ontitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(e.target.value);

  const onSavePost = () =>{
    try{
      if(canSave){
        setAddRequestStatus('pending');
        //using unwrap() to track the status 
        dispatch(addNewPost({title,body:content,userId})).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
        navigate("/");
      }
    }catch(err){
      console.error("Failed to save post",err);
    }
    finally{
      setAddRequestStatus('idle');
    }
  }

  const usersOptions = users.map(user =>(
      <option key={user.id} value={user.id}>{user.name}</option>
    ) 
  )

  const canSave =[title,content,userId].every(Boolean) && addRequestStatus === 'idle';
  
  return (
    <section>
      <h2>Add a New Post</h2>
      <label htmlFor="postTitle">Post Title: </label>
      <br></br>
      <input  
        type='text'
        name="postTitle"
        id='postTitle'
        value={title}
        onChange = {ontitleChanged}
      />
      <br></br>
      <label htmlFor="postAuthor">Author: </label><br></br>
      <select  id='postAuthor' value ={userId} onChange={onAuthorChanged}>
        {/* selected user's id will be stored in the value of select atrribute */}
        <option value=""></option>
        {usersOptions}
      </select><br></br>
      

      <label htmlFor="postContent">Content: </label>
      <br></br>
      <textarea  
        type='text'
        name="postContent"
        id='postContent'
        value={content}
        onChange = {onContentChanged}
      />
      <br></br>

      <button 
        style={{backgroundColor : (!canSave) ? 'white' : 'purple' , color: (!canSave) ? 'lightgray' : 'whiteSmoke'}}
        type="button" 
        id="saveButton" 
        onClick={onSavePost}
        disabled={!canSave}
      >
        Save Post
      </button>

    </section>
  )
}

export default AddPostForm;