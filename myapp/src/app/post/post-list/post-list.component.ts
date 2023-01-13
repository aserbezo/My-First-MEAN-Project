import { Component, Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import {Subscription} from 'rxjs'

import {Post} from '../post.models'
import { PostsService } from "../post.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponet implements OnInit, OnDestroy{
  posts: Post[]= []
  isLoading = false
  // variable for total post
  totalPosts = 0
  postsPerPage = 2
  currentPage = 1
  pageSizeOptions = [1,2,5,10]
  private postsSub : Subscription
  constructor ( public postService : PostsService) {}
  ngOnInit(): void {
    this.isLoading = true
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((postData: { posts: Post[], postCount: number}) => {
    this.isLoading = false
    this.totalPosts = postData.postCount
    this.posts = postData.posts

    })

  }

  onChangedPage(pageData: PageEvent){
    //console.log(pageData)
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }

  onDelete(postId: string){
    this.isLoading = true
    this.postService.deletePost(postId).subscribe(()=> {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    })
  }

  ngOnDestroy(): void {
    // prevent memory leaks
      this.postsSub.unsubscribe()
  }
}

