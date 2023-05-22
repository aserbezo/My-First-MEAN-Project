import { Component ,EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Post } from '../post.models'
import { PostsService } from "../post.service";
import { mimeType } from "./mime-type.validaror";

@Component({
  selector: 'app-post-create',
  templateUrl : './post-create.componet.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
    enteredTitle = ''
    enteredContent = ''
    post: Post
    isLoading = false
    form : FormGroup
    imagePreview: string
    private mode = 'create'
    private postId: string
    private authStatusSub: Subscription

    constructor (
      public postService: PostsService,
      public route: ActivatedRoute,
      private authService: AuthService
      ) {}
    // adding functionalaty to check if id is null to able to route
    ngOnInit(): void {
     this.authStatusSub = this.authService.getAuthStatusListenar().subscribe(
       authStatus => {
         this.isLoading = false
       }
     )
      // Reactive approach and setting validation on Title and Content
      this.form = new FormGroup({
        title: new FormControl(null, {validators : [Validators.required, Validators.minLength(3)]
        }),
        content: new FormControl(null, {validators: [Validators.required]}),
        image: new FormControl (null, {validators: [Validators.required], asyncValidators: [mimeType]})
      })
        this.route.paramMap.subscribe((paramMap:ParamMap)=> {
          if(paramMap.has('postId')){
             this.mode = 'edit'
             this.postId = paramMap.get('postId')
             this.isLoading = true
             this.postService.getPost(this.postId).subscribe(postData=> {
               this.isLoading = false
               this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath}
               // setting the value in the Form
               this.form.setValue({
                 title : this.post.title,
                 content: this.post.content,
                 image : this.post.imagePath

                })
             })
          }else{
            this.mode = 'create'
            this.postId = null
          }
        })
    }

    // adding image Picker
    onImagePicked (event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file})
        this.form.get('image').updateValueAndValidity()
        const reader = new FileReader()
        reader.onload = ()=> {
          this.imagePreview = reader.result as string
        }
        reader.readAsDataURL(file)

    }


    // saving the posts
    onSavePost(){
      if (this.form.invalid){
        return
      }
      this.isLoading = true
      if(this.mode === 'create'){
        this.postService.addPost(this.form.value.title,this.form.value.content,this.form.value.image)
      }else{
        this.postService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
          )
      }

      this.form.reset()
    }

    ngOnDestroy(): void {

      this.authStatusSub.unsubscribe()
    }
}
