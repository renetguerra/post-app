import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Post } from "@/interfaces/post";

interface PostState {
  posts: Post[];
  isSaving: boolean;
  titleMessageSaved: string | null;
  messageSaved: string | null;
  active: Post | null;
  postListTemp: Post[];
}

const initialState: PostState = {
  isSaving: false,
  titleMessageSaved: "",
  messageSaved: "",
  posts: [],
  active: null,
  postListTemp: [],
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    savingPost: (state) => {
      state.isSaving = true;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
      state.isSaving = false;
      state.titleMessageSaved = "Created Post";
      state.messageSaved = `${action.payload.title}, post created correctly`;
    },
    setActivePost: (state, action: PayloadAction<Post>) => {
      state.active = action.payload;
      state.titleMessageSaved = "";
      state.messageSaved = "";
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.titleMessageSaved = "";
      state.messageSaved = "";
    },
    setSaving: (state) => {
      state.isSaving = true;
      state.titleMessageSaved = "";
      state.messageSaved = "";
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      state.isSaving = false;
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.id) {
          return action.payload;
        }

        return post;
      });

      state.titleMessageSaved = "Updated Post";
      state.messageSaved = `${action.payload.title}, post updated correctly`;
    },
    filterPost: (state, action) => {
      state.active = null;

      if (state.postListTemp.length == 0) state.postListTemp = state.posts;

      state.posts = state.postListTemp;

      state.posts = state.posts.filter(
        (post) =>
          post.id === Number(action.payload) ||
          post.title.includes(action.payload) ||
          post.body.includes(action.payload)
      );
    },
    deletePostById: (state, action) => {
      state.active = null;

      const post = state.posts.find((post) => post.id === action.payload);

      state.posts = state.posts.filter((post) => post.id !== action.payload);

      const postIndex = state.postListTemp.findIndex(
        (post) => post.id === action.payload
      );
      state.postListTemp.splice(postIndex, 1);

      if (state.postListTemp.length > 0) state.posts = state.postListTemp;

      state.titleMessageSaved = "Deleted Post";
      state.messageSaved = `${post?.title}, post deleted correctly`;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  savingPost,
  addPost,
  setActivePost,
  setPosts,
  setSaving,
  updatePost,
  filterPost,
  deletePostById,
} = postSlice.actions;
