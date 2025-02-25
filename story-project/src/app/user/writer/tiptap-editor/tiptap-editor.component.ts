import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color'; 
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import { Extension } from '@tiptap/core';

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


@Component({
  selector: 'app-tiptap-editor',
  standalone: true,
  templateUrl: './tiptap-editor.component.html',
  styleUrl: './tiptap-editor.component.css'
})

export class TiptapEditorComponent {
  editor!: Editor;
  @Output() contentChange = new EventEmitter<string>();
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  ngOnInit(): void {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Underline,
        Link.configure({ openOnClick: true }),
        Image,
        TextStyle,
        Color, 
        BulletList,
        OrderedList,
        Heading.configure({ levels: [1, 2, 3] }),
        FontSize, 
      ],
      content: '<p>Start typing...</p>',
      onUpdate: ({ editor }) => {
        this.contentChange.emit(editor.getHTML());
      }
    });
  }
  

  ngAfterViewInit(): void {
    if (this.editorContainer) {
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

  uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
  
    if (file) {
      const reader = new FileReader();
      const img = document.createElement('img'); 
  
      reader.onload = (e) => {
        img.src = e.target?.result as string;
  
        img.onload = () => {
          const maxWidth = 1000;
          if (img.width > maxWidth) {
            alert(`Image width should not exceed ${maxWidth}px. Your image width is ${img.width}px.`);
          } else {
          
            this.editor.chain().focus().setImage({ src: img.src }).run();
          }
        };
      };
  
      reader.readAsDataURL(file);
    }
  }
  

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
