import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color'; 
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import { Extension } from '@tiptap/core';
import { StoryContentService } from '../../services/story-content.service'; 
import { Story } from '../../models/story.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { StoryApiService } from '../../services/story-api.service'; 
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

export const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes['fontSize']) return {}; 
              return { style: `font-size: ${attributes['fontSize']}` };  
            },
          },
        },
      },
    ];
  },
});

const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes['src']) return {};
          return { src: attributes['src'] };
        }
      },
      style: {
        default: 'display: block; margin: auto; max-width: 100%; height: auto;',
        parseHTML: element => element.getAttribute('style') || '',
        renderHTML: attributes => ({ style: attributes['style'] }),
      }
    };
  }
});



@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

    editor!: Editor;
    editorContent: string = ''; 
    storyContent: string = '';
    storyId: string = '';
    story?: Story;
    isStoryVisible = false;
    userId = localStorage.getItem('userId') as string;
    @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  
    constructor(private storyContentService: StoryContentService, 
      private http: HttpClient,
      private storyApiService: StoryApiService,
      private router: Router,
      private route: ActivatedRoute,
      private location: Location
        
    ) {}
  
    ngOnInit(): void {
      this.editor = new Editor({
        extensions: [
          StarterKit,
          Underline,
          Link.configure({ openOnClick: true }),
          CustomImage,
          TextStyle,
          Color,
          BulletList,
          OrderedList,
          Heading.configure({ levels: [1, 2, 3] }),
          FontSize,
          TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] }),
          
        ],
        content: '<p>Start typing...</p>',
        onUpdate: ({ editor }) => this.onUpdate(editor),
      });

      this.storyId = this.route.snapshot.paramMap.get('id') || '';
     
      if (this.storyId) {
        this.loadStoryContent();
      }
     
 
  
   
    }


    loadStoryContent() {
      this.storyApiService.getStoryById(this.storyId).subscribe(
        (data: Story) => {
          this.story = data;
          this.storyContent = data.content || '<p>Start writing...</p>';
          this.editor.commands.setContent(this.storyContent, false);
         
        },
        error => {
          console.error('Error fetching story:', error);
        }
      );
    }
  
    onUpdate(editor: Editor) {
      this.editorContent = editor.getHTML();
      this.storyContent = this.editorContent;
    
    }
  
    ngAfterViewInit(): void {
      if (this.editorContainer && !this.editorContainer.nativeElement.contains(this.editor.view.dom)) {
        this.editorContainer.nativeElement.appendChild(this.editor.view.dom);
      }
    }
  
    setFontSize(event: Event) {
      const size = (event.target as HTMLSelectElement).value;
      this.editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
    }
    
    setTextColor(event: Event) {
      const color = (event.target as HTMLInputElement).value;
      this.editor.chain().focus().setMark('textStyle', { color }).run();
    }
  
    setAlignment(alignment: string) {
      this.editor.chain().focus().updateAttributes('paragraph', { textAlign: alignment }).run();
    }
  
    uploadImage(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
  
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.src = src;
  
        img.onload = () => {
           if (img.width > 1000) {
                   Swal.fire({
                     title: "Image Too Large",
                     text: `Image width should not exceed 1000px. Your image width is ${img.width}px.`,
                     icon: "warning",
                   });
                   return;
                 }
                 
          this.editor.chain().focus().setImage({ src }).run();
  
          setTimeout(() => {
            this.onUpdate(this.editor);
          }, 100);
        };
      };
  
      reader.readAsDataURL(file);
    }
  
    saveContent() {
      if (!this.storyId) {
        console.error('Error: Story ID is missing!');
        return;
      }
  
      const updatedStory: Partial<Story> = {
        content: this.storyContent.trim(),

       
      };

    
      this.storyApiService.patchStory(this.storyId, updatedStory).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Story Updated!',
            text: 'Your story has been successfully updated.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            showClass: {
              popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutDown animate__faster'
            }
          }).then(() => {
            this.router.navigate(['/user/my-story']);
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed!',
            text: 'There was an error updating your story. Please try again.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
            showClass: {
              popup: 'animate__animated animate__shakeX animate__faster'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutDown animate__faster'
            }
          });
          console.error('Error:', error);
        }
      );
      
    }

     onPublish() {
    if (!this.story) return;

    const updatedStory: Partial<Story> = {
      content: this.storyContent.trim(),
      status: "PUBLISHED",
    };

    this.storyApiService.patchStory(this.storyId, updatedStory).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Story Updated!',
          text: 'Your story has been successfully updated.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/user/my-story']);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed!',
          text: 'There was an error updating your story. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
        console.error('Error:', error);
      }
    );
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
         this.location.back();
         Swal.fire(
           'Cancelled!',
           'Your action has been cancelled.',
           'success'
         );
       }
     });
   }
    

    ngOnDestroy(): void {
      this.editor?.destroy();
    }

}
