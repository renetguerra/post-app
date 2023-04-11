import { Post } from "@/interfaces/post";
import { postApi } from "../api";


export const getPosts = async()  => {    
    try {
        const { data } = await postApi.get<Post[]>(`/posts/`)
        
        const posts: Post[] = [];
        data.map( post => {
            posts.push({ ...post });
        });
    
        return posts;
    } catch (error) {
        return null;
    }
}

export const getPostInfo = async( nameOrId: string )  => {    
    try {
        const { data } = await postApi.get<Post>(`/post/${ nameOrId }`)
        
        return {
            id: data.id,
            title: data.title,
            body: data.body
        }
    } catch (error) {
        return null;
    }
}