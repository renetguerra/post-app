import { postApi } from "@/api";
import { Post } from "@/interfaces/post";
import { addPost, deletePostById, filterPost, savingPost, setActivePost, setPosts, setSaving, updatePost } from "./postSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import Cookies from "js-cookie";
import { getPosts } from "@/helpers/postRequest";

export const startAddPost = (postToCreate: Post) => {
    return async(dispatch: AppDispatch, getState: () => RootState) => {        
        dispatch( savingPost() );             

        const response = await postApi.post<Post>('/posts', postToCreate);
        
        if (postToCreate.id == 0)
            postToCreate.id = response.data.id;  
        
        //! dispatch
        dispatch( setActivePost( postToCreate ) );
        dispatch( addPost( postToCreate ) );
        

    }
}

export const startLoadingPosts = () => {    
    return async( dispatch: AppDispatch, getState: () => RootState ) => {                  
        const posts = await getPosts();
                    
        const postListTemp = localStorage.getItem('postListTemp') != null ? [...JSON.parse(localStorage.getItem('postListTemp'))] : []
                
        if (postListTemp.length > 0) {
            dispatch( setPosts( postListTemp ) );
        }
        else {

            dispatch( setPosts( posts ) );
        }
    }
}

export const startSavePost = (postToSave: Post) => {    
    return async( dispatch: AppDispatch, getState: () => RootState ) => {        
        dispatch( setSaving() );
                
        const { active:post } = getState().post;       

        if (postToSave.id > 0)
            dispatch( updatePost( postToSave ) );
        else
            dispatch( addPost(postToSave) );

    }
}

export const startDeletingPost = () => {
    return async( dispatch: AppDispatch, getState: () => RootState ) => {        
        const { active: post } = getState().post;        
        dispatch( deletePostById(post?.id) );
    }
}

