import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import {
    DecoupledEditor,
    Bold,
    Essentials,
    Italic,
    Underline,
    Paragraph,
    List,
    ListProperties,
    Link,
    Image,
    ImageUpload,
    ImageStyle,
    ImageToolbar,
    ImageCaption,
    ImageResize,
    ImageInsert,
    Heading,
    BlockQuote,
    Table,
    TableToolbar,
    Alignment,
    PasteFromOffice,
    MediaEmbed,
    FontSize,
    FontColor,
    FontFamily,
    BalloonToolbar
} from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import 'ckeditor5/ckeditor5.css';
import './editor.css';

function App() {
    const editorToolbarRef = useRef<HTMLDivElement>(null);
    const [isMounted, setMounted] = useState(false);
    const [editorInstance, setEditorInstance] = useState<any>(null);

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    const exportToPdf = () => {
        if (editorInstance) {
            const editorData = editorInstance.getData();
            const element = document.createElement('div');
            element.innerHTML = editorData;
            
            const opt = {
                margin: 1,
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();
        }
    };

    const key = "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTMxNDIzOTksImp0aSI6ImZlN2FhMzJlLTIyMTAtNGEzYi1hZDlkLWI1ZmJiY2NjM2E3NyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjM2ZTE3MmUzIn0.jtGqTPNdh2g2AEDT2dzuQOP0PJC1Hq3M_Kz5I1qYONUKwPw7LhOBPcjoNQKF9Pg-kUyLgq_h4QrXk7zGBW_bKw";

    return (
        <div className="editor-container">
            <div className="toolbar-container" ref={editorToolbarRef}>
                <button 
                    className="export-pdf-button" 
                    onClick={exportToPdf}
                >
                    Export to PDF
                </button>
            </div>
            <div className="editor-content">
                {isMounted && (
                    <CKEditor
                        editor={DecoupledEditor}
                        data="<p>Hello from CKEditor 5 decoupled editor!</p>"
                        config={{
                            licenseKey: key,
                            plugins: [
                                Essentials,
                                Bold,
                                Italic,
                                Underline,
                                Paragraph,
                                List,
                                ListProperties,
                                Link,
                                Image,
                                ImageUpload,
                                ImageStyle,
                                ImageToolbar,
                                ImageCaption,
                                ImageResize,
                                ImageInsert,
                                Heading,
                                BlockQuote,
                                Table,
                                TableToolbar,
                                Alignment,
                                PasteFromOffice,
                                MediaEmbed,
                                FontSize,
                                FontColor,
                                FontFamily,
                                BalloonToolbar
                            ],
                            list: {
                                properties: {
                                    styles: true,
                                    startIndex: true,
                                    reversed: true
                                }
                            },
                            fontFamily: {
                                options: [
                                    'default',
                                    'Arial',
                                    'Courier New',
                                    'Georgia',
                                    'Lucida Sans Unicode',
                                    'Tahoma',
                                    'Times New Roman',
                                    'Trebuchet MS'
                                ]
                            },
                            fontSize: {
                                options: [
                                    8,
                                    12,
                                    14,
                                    16,
                                    18,
                                    20,
                                    22
                                ]
                            },
                            fontColor: {
                                colors: [
                                    {
                                        color: '#000000',
                                        label: 'Black'
                                    },
                                    {
                                        color: '#4D4D4D',
                                        label: 'Dark gray'
                                    },
                                    {
                                        color: '#FF0000',
                                        label: 'Red'
                                    },
                                    {
                                        color: '#FF8C00',
                                        label: 'Orange'
                                    },
                                    {
                                        color: '#FFFF00',
                                        label: 'Yellow'
                                    },
                                    {
                                        color: '#00FF00',
                                        label: 'Green'
                                    },
                                    {
                                        color: '#00FFFF',
                                        label: 'Cyan'
                                    },
                                    {
                                        color: '#0000FF',
                                        label: 'Blue'
                                    },
                                    {
                                        color: '#9932CC',
                                        label: 'Purple'
                                    },
                                    {
                                        color: '#FF69B4',
                                        label: 'Pink'
                                    }
                                ]
                            },
                            heading: {
                                options: [
                                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                                ]
                            },
                            toolbar: [
                                'undo', 'redo',
                                '|',
                                'heading',
                                '|',
                                'fontFamily',
                                'fontSize',
                                '|',
                                'fontColor',
                                '|',
                                'bold', 'italic', 'underline',
                                '|',
                                'link',
                                '|',
                                'bulletedList', 'numberedList',
                                '|',
                                'insertImage', 'blockQuote',
                                '|',
                                'insertTable',
                                '|',
                                'alignment',
                                '|',
                                'mediaEmbed'
                            ],
                            balloonToolbar: [
                                'bold', 'italic', 'underline',
                                '|',
                                'fontFamily', 'fontSize', 'fontColor',
                                '|',
                                'link',
                                '|',
                                'bulletedList', 'numberedList',
                                '|',
                                'alignment'
                            ],
                            image: {
                                toolbar: [
                                    'imageStyle:inline',
                                    'imageStyle:block',
                                    'imageStyle:side',
                                    '|',
                                    'toggleImageCaption',
                                    'imageTextAlternative',
                                    '|',
                                    'resizeImage'
                                ],
                                upload: {
                                    types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
                                },
                                insert: {
                                    type: 'auto',
                                    integrations: ['upload', 'url']
                                }
                            },
                            table: {
                                contentToolbar: [
                                    'tableColumn',
                                    'tableRow',
                                    'mergeTableCells'
                                ]
                            }
                        }}
                        onReady={(editor: any) => {
                            const toolbarElement = editor.ui.view.toolbar.element;
                            if (editorToolbarRef.current && toolbarElement) {
                                editorToolbarRef.current.appendChild(toolbarElement);
                            }
                            setEditorInstance(editor);
                        }}
                        onDestroy={() => {
                            if (editorToolbarRef.current) {
                                const children = Array.from(editorToolbarRef.current.children);
                                children.forEach((child: Element) => child.remove());
                            }
                            setEditorInstance(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
