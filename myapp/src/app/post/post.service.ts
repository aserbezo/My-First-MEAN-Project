import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { Subject} from "rxjs"
import  { map } from "rxjs/operators"
import { Post } from "./post.models";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class PostsService{
 private posts: Post[] = []
 private postsUpdated = new Subject<Post[]>()

 // this way we are injecting the httpclient in the function
constructor(private httpClient: HttpClient, private router : Router ){}

 getPosts(){
   this.httpClient.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
   .pipe(map((postData)=>{
    return postData.posts.map(post=> {
      return{
        id: post._id,
        title : post.title,
        content: post.content

      }
    })
   }))
   .subscribe( (transformedPosts)=> {
    this.posts = transformedPosts
    this.postsUpdated.next([...this.posts])
   })
 }

getPostUpdateListener(){
  return this.postsUpdated.asObservable()
}

getPost (id:string){
  return this.httpClient.get<{_id: string, title: string , content: string}>('http://localhost:3000/api/posts/' + id)
}

 addPost(title:string,content:string){
   const post: Post = {id: null ,title:title , content:content }
   this.httpClient.post<{message:string, postId: string}>('http://localhost:3000/api/posts', post)
   .subscribe((responseData)=>{
      const id = responseData.postId
      post.id = id
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
      //console.log(this.postsUpdated)
      // adding loading
      this.router.navigate(['/'])
   })


 }

updatePost(id:string, title:string, content:string){
  const post:Post = {id: id, title: title, content: content}
  this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
  .subscribe(response=>{
    console.log(response)
    const updatePosts = [...this.posts]
    const oldPostIndex = updatePosts.findIndex(p=> p.id === post.id)
    updatePosts[oldPostIndex]= post
    this.posts = updatePosts
    this.postsUpdated.next([...this.posts])
    this.router.navigate(['/'])

  })
}

 deletePost(postId:string){
   this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
   .subscribe(()=>{
     console.log("Deleted!")
     const updatedPosts = this.posts.filter(post=> post.id !== postId)
    // console.log(updatedPosts)
     this.posts = updatedPosts
     this.postsUpdated.next([...this.posts])
   })
 }
}
