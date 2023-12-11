import { createSlice, createAsyncThunk, createSelector ,createEntityAdapter} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postAdapter = createEntityAdapter({
  sortComparer : (a,b) => b.date.localeCompare(a.date)
})

//we already got the posts from the postAdapter..So we don't need to set posts=[]

const initialState =postAdapter.getInitialState( {
  status: "idle", //'idle' | 'loading', | 'succeed' | 'failed'
  error: null,
});

//To fetch data
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

//To post data
export const addNewPost = createAsyncThunk('posts/addNewPost',async (initialPost) => {
  const response = await axios.post(POSTS_URL,initialPost);
  return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost)=>{
  const {id} = initialPost;
  try{
    console.log(initialPost);
    const response = await axios.put(`${POSTS_URL}/${id}`,initialPost);
    return response.data;
  }
  catch(err){
    //As the newly added won't be added to the api, we will return on updation to the user created post
    //So, on return we could get the post we sent as a updation..We could use it for display
    return initialPost;
  }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost)=>{
  const {id}=initialPost
  try{
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    if(response?.status === 200) return initialPost;

    return `${response?.status} : ${response?.statusText}`
  }
  catch(err){
    return err.message;
  }
})

//id:{}
//entities:{}

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      //To get the particular posts which the people rect
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        postAdapter.upsertMany(state,loadedPosts);
        
      })

      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state,action) => {
        const sortedPosts = state.posts.sort((a,b) => {
          if(a.id > b.id ) return 1
          if(a.id < b.id ) return -1
          return 0
        })
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        postAdapter.addOne(state,action.payload);
      })

      .addCase(updatePost.fulfilled ,(state,action)=>{
        //once the update operation done in updatePost function,it will return either data(if succeed) or the error msg
        if(!action.payload?.id){
          console.log("Update Could not complete");
          console.log(action.payload);
          return;
        }
        action.payload.date=new Date().toISOString();
        postAdapter.upsertOne(state,action.payload);
      })

      .addCase(deletePost.fulfilled , (state,action) =>{
        if(!action.payload?.id){
          console.log("Delete Could not complete");
          console.log(action.payload);
          return;
        }
        const {id}=action.payload;
        postAdapter.removeOne(state,id);
      })
  }
});

//getSelectors() create these selectors and we rename them with laliases using destructing

export const {
  selectAll : selectAllPosts,
  selectById : selectPostById,
  selectIds : selectPostIds 

} = postAdapter.getSelectors(state =>state.posts);

export const getPostsError = (state) => state.posts.error;
export const getPostsStatus = (state) => state.posts.status;


//MEMOIZATION=>Caching  ==== >Will save the repeated operations in cache and 
//only operate on the different operation to reduce the unwanted rendering 

export const selectPostByUser = createSelector(
  //must give a function as a parameter to createSelector()
  [selectAllPosts, (state,userId) => userId],
  (posts,userId)=> posts.filter(post => post.userId === userId)
)

export const { postAdded, reactionAdded } = postSlice.actions;
export default postSlice.reducer;
