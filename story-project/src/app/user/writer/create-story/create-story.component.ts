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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-story',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule,FormsModule],
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
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
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
    if (!this.user) {
        Swal.fire('Error', 'User is not logged in!', 'error');
        return;
    }

    if (this.storyForm.invalid) {
        const errors = [];

        if (!this.coverImageUrl) {
          errors.push('Cover image is required.');
      }

        const title = this.storyForm.controls['title'];
        if (title.errors) {
            if (title.errors['required']) errors.push('Title is required.');
            if (title.errors['minlength']) errors.push(`Title must be at least ${title.errors['minlength'].requiredLength} characters.`);
            if (title.errors['maxlength']) errors.push(`Title must be at most ${title.errors['maxlength'].requiredLength} characters.`);
        }

        const summary = this.storyForm.controls['summary'];
        if (summary.errors) {
            if (summary.errors['required']) errors.push('Summary is required.');
            if (summary.errors['minlength']) errors.push(`Summary must be at least ${summary.errors['minlength'].requiredLength} characters.`);
            if (summary.errors['maxlength']) errors.push(`Summary must be at most ${summary.errors['maxlength'].requiredLength} characters.`);
        }

        const genre = this.storyForm.controls['genre'];
        if (genre.errors?.['required']) {
            errors.push('Genre is required.');
        }

        if (!this.storyForm.value.tags || this.storyForm.value.tags.length === 0) {
            errors.push('At least one tag is required.');
        }

        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            html: errors.join('<br/>'),
        });

        return;
    }

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
        updatedAt: new Date().toISOString(),
        publishedDate: new Date().toISOString(),
        status: "DRAFT",
    };

    this.storyContentService.setStoryData(storyData);
   
    this.router.navigate(['/user/write-story']);
}

  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (result) {
          const img = new Image();
          img.onload = () => {
            if (img.width === 256 && img.height === 400) {
              this.coverImageUrl = result as string;
              this.storyForm.patchValue({ coverImageUrl: this.coverImageUrl });
            } else {
              Swal.fire('Invalid Size', 'Image must be exactly 256x400 pixels.', 'error');
            }
          };
          img.onerror = () => {
            Swal.fire('Invalid Image', 'Could not load image. Try another file.', 'error');
          };
          img.src = result as string;
        } else {
          Swal.fire('Error', 'Failed to read the file.', 'error');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.coverImageUrl = null;
    this.storyForm.patchValue({ coverImageUrl: '' });
  }

  cancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to reterive this data!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/user']);
        Swal.fire(
          'Cancelled!',
          'Your action has been cancelled.',
          'success'
        );
      }
    });
  }
  
}
