import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { CreateStoryComponent } from './writer/create-story/create-story.component';
import { TiptapEditorComponent } from './writer/tiptap-editor/tiptap-editor.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, HomeComponent, CreateStoryComponent, TiptapEditorComponent,
    RouterModule.forChild([
      { path:"", component:HomeComponent },
      { path:"new-story", component: CreateStoryComponent},
      { path:"write-story", component: TiptapEditorComponent}
    ])
  ]
})
export class UserModule { }
