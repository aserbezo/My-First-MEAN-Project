import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { Subject} from "rxjs"
import  { map } from "rxjs/operators"
import { Post } from "./post.models";
import { Router } from "@angular/router";

const BACKEND_URL = 'http://localhost:3000/api/posts'


@Injectable({
  providedIn: 'root'
})
export class PostsService{
 private posts: Post[] = []
 private postsUpdated = new Subject<{posts:Post[],postCount:number}>()

 // this way we are injecting the httpclient in the function
constructor(private httpClient: HttpClient, private router : Router ){}

 getPosts(postsPerPage: number, currentPage: number){
   const querryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
   this.httpClient.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL+ querryParams)
   .pipe
   (map((postData)=>{
    return {posts:postData.posts.map(post=> {
      return{
        id: post._id,
        title : post.title,
        content: post.content,
        imagePath : post.imagePath,
        creator: post.creator

      }
    }), maxPosts: postData.maxPosts}
   }))
   .subscribe( (transformedPostData)=> {
     console.log(transformedPostData)
    this.posts = transformedPostData.posts
    this.postsUpdated.next({posts:[...this.posts],postCount: transformedPostData.maxPosts} )
   })
 }

getPostUpdateListener(){
  return this.postsUpdated.asObservable()
}

getPost (id:string){
  return this.httpClient.get<{_id: string, title: string , content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id)
}

 addPost(title:string,content:string, image: File){
   //const post: Post = {id: null ,title:title , content:content }
   const postData = new FormData()
   postData.append('title', title)
   postData.append('content', content)
   postData.append('image',image, title)
   this.httpClient.post<{message:string, post: Post}>(BACKEND_URL, postData)
   .subscribe((responseData)=>{
    //  const post: Post = {id: responseData.post.id, title : title, content:content, imagePath: responseData.post.imagePath}
    //   this.posts.push(post)
    //   this.postsUpdated.next({posts:[...this.posts],postCount: transformedPostData.maxPosts})
    //   console.log(this.postsUpdated)
    //   // adding loading
      this.router.navigate(['/'])
   })


 }

updatePost(id:string, title:string, content:string, image: File | string){
  let postData: Post | FormData
  if(typeof(image) ==='object'){
    postData = new FormData()
    postData.append("id", id)
    postData.append("title", title)
    postData.append("content", content)
    postData.append("image", image,title)
  }else{
      postData = {
      id: id,
      title: title,
      content: content,
      imagePath: image
    }

  }
  console.log(postData)
  this.httpClient.put(BACKEND_URL + id, postData)
  .subscribe(response=>{
    // const updatePosts = [...this.posts]
    // const oldPostIndex = updatePosts.findIndex(p=> p.id === id)
    // const post : Post = {
    //   id: id,
    //   title: title,
    //   content: content,
    //   imagePath: ''
    // }
    // updatePosts[oldPostIndex]= post
    // this.posts = updatePosts
    // this.postsUpdated.next([...this.posts])
    this.router.navigate(['/'])

  })
}

 deletePost(postId:string){
   return  this.httpClient.delete(BACKEND_URL + postId)
  //  .subscribe(()=>{
  //    console.log("Deleted!")
  //    const updatedPosts = this.posts.filter(post=> post.id !== postId)
  //   // console.log(updatedPosts)
  //    this.posts = updatedPosts
  //    this.postsUpdated.next([...this.posts])
  //  })
 }
}
