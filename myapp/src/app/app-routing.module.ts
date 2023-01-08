import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"
import { PostCreateComponent } from "./post/post-create/post-create.component";
import { PostListComponet } from "./post/post-list/post-list.component";

const routes: Routes = [
  {path: '', component: PostListComponet },
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component:PostCreateComponent}
]

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]

})

export class AppRoutingModule {

}
