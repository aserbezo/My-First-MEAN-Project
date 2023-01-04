import { Component ,EventEmitter, Output} from "@angular/core";
import { NgForm } from "@angular/forms";
import { throwToolbarMixedModesError } from "@angular/material/toolbar";

import { Post } from '../post.models'
import { PostsService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl : './post-create.componet.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    enteredTitle = ''
    enteredContent = ''
    newPost = 'No CONTENT'


    constructor (public postService: PostsService) {}

    onAddPost(form: NgForm){
      if (form.invalid){
        return
      }
      this.postService.addPost(form.value.title,form.value.content)
      form.resetForm()
    }
}
