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
import { StoryContentService } from '../../../services/story-content.service'; 
import { Story } from '../../../models/story.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { StoryApiService } from '../../../services/story-api.service'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
      style: {
        default: 'display: block; margin: auto; max-width: 100%; height: auto;',
        parseHTML: (element) => element.getAttribute('style') || '',
        renderHTML: (attributes) => ({ style: attributes['style'] }),
      },
    };
  },
});

@Component({
  selector: 'app-tiptap-editor',
  standalone: true,
  templateUrl: './tiptap-editor.component.html',
  styleUrls: ['./tiptap-editor.component.css']
})
export class TiptapEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  
  editor!: Editor;
  editorContent: string = ''; 
  storyContent: string = '';
  // @Output() contentChange = new EventEmitter<string>();
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  constructor(private storyContentService: StoryContentService, 
    private http: HttpClient,
    private storyApiService: StoryApiService,
    private router: Router
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
        TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] })
      ],
      content: '<p>Start typing...</p>',
      onUpdate: ({ editor }) => this.onUpdate(editor),
    });
  }

  onUpdate(editor: Editor) {
    this.editorContent = editor.getHTML();
    this.storyContent = this.editorContent;
    // this.contentChange.emit(this.editorContent);
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
          alert(`Image width should not exceed 1000px. Your image width is ${img.width}px.`);
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
    const storyData = this.storyContentService.getStoryData();
    if (!storyData) {
      console.error('Error: No story data available!');
      return;
    }

    storyData.status = "DRAFT";

    const fullStory: Story = {
      ...storyData,
      content: this.storyContent.trim(),
    };

    console.log(fullStory);

    // if (!fullStory.content) {
    //   console.error('Error: Story content is empty!');
    //   return;
    // }

    this.storyApiService.postStory(fullStory).subscribe(
      data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Story Posted!',
          text: 'Your story has been successfully posted.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/user/my-story']);
        });
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to post the story. Please try again later.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    );
    
  }

  onPublish() {
    const storyData = this.storyContentService.getStoryData();
    if (!storyData) {
      console.error('Error: No story data available!');
      return;
    }
    storyData.status = "PUBLISHED";


    const fullStory: Story = {
      ...storyData,
      content: this.storyContent.trim(),
    };

    console.log(fullStory);

    // if (!fullStory.content) {
    //   console.error('Error: Story content is empty!');
    //   return;
    // }

    this.storyApiService.postStory(fullStory).subscribe(
      data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Story Posted!',
          text: 'Your story has been successfully posted.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/user/my-story']);
        });
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to post the story. Please try again later.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
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
          this.router.navigate(['/user']);
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
