import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { TiptapEditorComponent } from '../tiptap-editor/tiptap-editor.component';
import { Router } from '@angular/router';
import { StoryContentService } from '../../../services/story-content.service'; 
import { User } from '../../../models/user.model';
import { UserApiService } from '../../../services/user-api.service'; 
import { Story } from '../../../models/story.model';

@Component({
  selector: 'app-create-story',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule, TiptapEditorComponent, FormsModule],
  templateUrl: './create-story.component.html',
  styleUrl: './create-story.component.css'
})
export class CreateStoryComponent {
  storyForm: FormGroup;
  coverImageUrl: string | ArrayBuffer | null = null;
  selectedGenre: string | null = null;
  showGenres: boolean = false;
  user: User| null = null;

  genres: string[] = [
    'Action/Adventure', 'Fantasy', 'Science Fiction', 'Romance', 'General Fiction',
    'Horror', 'Mystery/Thriller', 'Paranormal', 'Humor', 'Historical', 'Teen Fiction'
  ];

  constructor(
    private fb: FormBuilder,
    private storyContentService: StoryContentService,
    private router: Router,
    private userApiService: UserApiService
  ) {
    this.storyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      authorId: ['', Validators.required],
      authorName: ['', Validators.required],
      genre: ['', Validators.required],
      newTag: [''],
      tags: this.fb.array([], Validators.required),
      isPaid: [false, Validators.required],
      coverImageUrl: ['', Validators.required]
    });

    this.userApiService.getUserById(localStorage.getItem('userId') as string).subscribe(
      (data: User) => {
        this.user = data;
    
        this.storyForm.get('authorId')?.setValue(this.user.id);
        this.storyForm.get('authorName')?.setValue(this.user.username);
      }
    );
    
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.target.value;
    this.showGenres = true;
  }

  get tags(): FormArray {
    return this.storyForm.get('tags') as FormArray;
  }

  addTag(inputElement: HTMLInputElement) {
    const trimmedTag = this.storyForm.get('newTag')?.value.trim();
    if (trimmedTag && !this.tags.value.includes(trimmedTag)) {
      this.tags.push(this.fb.control(trimmedTag));
      this.storyForm.get('newTag')?.setValue('');
      this.storyForm.updateValueAndValidity();
      inputElement.focus();
    }
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
    this.storyForm.updateValueAndValidity();
  }
  submitStory() {
    // if (this.storyForm.valid && this.user) {
      const formData = this.storyForm.value;
  
      const storyData: Partial<Story> = {
        id: undefined,
        title: formData.title || null,
        summary: formData.summary || null,
        content: '',  
        authorId: this.user?.id ?? undefined, 
        authorName: this.user?.username ?? undefined,
        genre: formData.genre || null,
        tags: formData.tags?.length ? formData.tags : null,
        paid: formData.isPaid || false,
        posterUrl: formData.coverImageUrl, 
        likeCount: 0,
        viewCount: 0,
        subscriptions: 0,
        createdAt: new Date().toISOString(),
        updatedAt:new Date().toISOString(),
        publishedDate: new Date().toISOString(),
        status: "DRAFT",
      };
  
      this.storyContentService.setStoryData(storyData);
  
      console.log('Story saved:', storyData);
      this.router.navigate(['/user/write-story']);
    // } else {
    //   console.log('Invalid form submission!');
    // }
  }
  
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.coverImageUrl = e.target.result as string | ArrayBuffer;
          this.storyForm.patchValue({ coverImageUrl: this.coverImageUrl }); 
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.coverImageUrl = null;
    this.storyForm.patchValue({ coverImageUrl: '' });
  }
}
