import { Component, Directive, Input, OnDestroy, OnInit } from "@angular/core";
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
  private postsSub : Subscription
  constructor ( public postService : PostsService) {}
  ngOnInit(): void {
    this.posts = this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts:Post[]) => {
    this.posts = posts

    })

  }

  ngOnDestroy(): void {
    // prevent memory leaks
      this.postsSub.unsubscribe()
  }
}
