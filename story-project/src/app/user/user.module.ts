import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { CreateStoryComponent } from './writer/create-story/create-story.component';
import { TiptapEditorComponent } from './writer/tiptap-editor/tiptap-editor.component';
import { MyStoryComponent } from './writer/my-story/my-story.component';
import { ReadStoryComponent } from './read-story/read-story.component';
import { FullStoryComponent } from './full-story/full-story.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, HomeComponent, CreateStoryComponent, TiptapEditorComponent, MyStoryComponent, 
    ReadStoryComponent, FullStoryComponent, PaymentComponent, ProfileComponent,
    RouterModule.forChild([
      { path: "", component: HomeComponent },
      { path: "new-story", component: CreateStoryComponent },
      { path: "write-story", component: TiptapEditorComponent },
      { path: "my-story", component: MyStoryComponent },
      {path: "read-story/:id", component: ReadStoryComponent},
      {path: "full-story/:id", component: FullStoryComponent},
      {path: "payment", component: PaymentComponent},
      {path: "profile", component: ProfileComponent},
    ])
  ]
})
export class UserModule { }
