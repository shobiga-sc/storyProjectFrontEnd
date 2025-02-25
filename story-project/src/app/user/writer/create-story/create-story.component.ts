import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { TiptapEditorComponent } from '../tiptap-editor/tiptap-editor.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-create-story',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule, TiptapEditorComponent, RouterLink, FormsModule],
  templateUrl: './create-story.component.html',
  styleUrl: './create-story.component.css'
})
export class CreateStoryComponent {
  storyForm: FormGroup;
  coverImageUrl: string | ArrayBuffer | null = null;
  selectedGenre: string | null = null;
  showGenres: boolean = false; 
  newTag: string = ''; 

  
genres: string[] = [
  'Action/Adventure', 
  'Fantasy', 
  'Science Fiction', 
  'Romance', 
  'General Fiction', 
  'Horror', 
  'Mystery/Thriller', 
  'Paranormal', 
  'Humor', 
  'Historical', 
  'Teen Fiction'
];
  constructor(private fb: FormBuilder) {
    this.storyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      posterUrl: ['', Validators.required],
      summary: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      content: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(10000)]],
      authorId: ['', Validators.required],
      authorName: ['', Validators.required],
      genre: ['', Validators.required], 
      tags: this.fb.array([], Validators.required),
      isPaid: [false, Validators.required]
    });
  }
  onGenreChange(event: any) {
    this.selectedGenre = event.target.value;
    this.showGenres = true;
  }
  
  get tags() {
    return this.storyForm.get('tags') as FormArray;
  }

  addTag(inputElement: HTMLInputElement) {
    const trimmedTag = this.newTag.trim();
    if (trimmedTag !== '' && !this.tags.value.includes(trimmedTag)) {
        this.tags.push(this.fb.control(trimmedTag));
        this.newTag = ''; // Clear input after adding
        this.storyForm.updateValueAndValidity();
        
        // ✅ Automatically focus back on the input field after adding a tag
        inputElement.focus();
    }
}


  removeTag(index: number) {
    this.tags.removeAt(index);

    this.storyForm.updateValueAndValidity();
  }


  submitStory() {
    if (this.storyForm.valid) {
      console.log('Story Data:', this.storyForm.value);
     
    } else {
      console.log('Invalid form!');
    }
  }

 


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.coverImageUrl = e.target.result as string | ArrayBuffer;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.coverImageUrl = null;
}





  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };
}
