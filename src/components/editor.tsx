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

type Editor = DecoupledEditor;

function App() {
    const editorToolbarRef = useRef<HTMLDivElement>(null);
    const tocRef = useRef<HTMLDivElement>(null);
    const [isMounted, setMounted] = useState(false);
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [toc, setToc] = useState<Array<{ id: string; title: string; level: number }>>([]);

    useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
            if (editorToolbarRef.current) {
                const children = Array.from(editorToolbarRef.current.children);
                children.forEach((child: Element) => child.remove());
            }
        };
    }, []);

    const exportToPdf = () => {
        if (editorInstance) {
            const editorData = editorInstance.getData();
            const element = document.createElement('div');
            element.innerHTML = editorData;
            element.style.width = '816px'; // Letter size width
            element.style.padding = '40px';
            element.style.boxSizing = 'border-box';
            
            // Apply necessary styles for tables
            const tables = element.getElementsByTagName('table');
            Array.from(tables).forEach(table => {
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.marginBottom = '1em';
                
                const cells = table.getElementsByTagName('td');
                Array.from(cells).forEach(cell => {
                    cell.style.border = '1px solid #ccc';
                    cell.style.padding = '8px';
                });
            });

            // Wait for images to load before generating PDF
            const images = element.getElementsByTagName('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) {
                    return Promise.resolve();
                }
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Handle error case as well
                });
            });

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: 'document.pdf',
                image: { 
                    type: 'jpeg', 
                    quality: 1
                },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    allowTaint: true
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait'
                }
            };

            // Add editor styles to maintain formatting
            const style = document.createElement('style');
            style.textContent = `
                img { max-width: 100%; height: auto; }
                table { width: 100%; border-collapse: collapse; }
                td, th { border: 1px solid #ccc; padding: 8px; }
                blockquote { border-left: 4px solid #ccc; padding-left: 16px; margin-left: 0; }
                h1 { font-size: 2em; margin: 0.67em 0; }
                h2 { font-size: 1.5em; margin: 0.75em 0; }
                h3 { font-size: 1.17em; margin: 0.83em 0; }
            `;
            element.appendChild(style);

            // Wait for images to load before generating PDF
            Promise.all(imagePromises)
                .then(() => {
                    html2pdf()
                        .set(opt)
                        .from(element)
                        .save()
                        .catch((err: Error) => {
                            console.error('Error generating PDF:', err);
                            alert('Error generating PDF. Please try again.');
                        });
                });
        }
    };
    let key = ""

    //  key = "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTMxNDIzOTksImp0aSI6ImZlN2FhMzJlLTIyMTAtNGEzYi1hZDlkLWI1ZmJiY2NjM2E3NyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjM2ZTE3MmUzIn0.jtGqTPNdh2g2AEDT2dzuQOP0PJC1Hq3M_Kz5I1qYONUKwPw7LhOBPcjoNQKF9Pg-kUyLgq_h4QrXk7zGBW_bKw";

     key ="GPL"

    // Function to update table of contents
    const updateTableOfContents = (editor: Editor) => {
        try {
            const root = editor.model.document.getRoot();
            if (!root) return;

            const newToc: Array<{ id: string; title: string; level: number }> = [];
            let index = 0;

            // @ts-expect-error - CKEditor types are not complete for model nodes
            for (const item of root.getChildren()) {
                // @ts-expect-error - CKEditor types are not complete for model nodes
                const itemName = item.name || '';
                if (itemName.startsWith('heading')) {
                    const level = parseInt(itemName.replace('heading', '')) || 1;
                    let title = '';
                    
                    // @ts-expect-error - CKEditor types are not complete for model nodes
                    for (const child of item.getChildren()) {
                        // @ts-expect-error - CKEditor types are not complete for model nodes
                        if (child.is('text')) {
                            // @ts-expect-error - CKEditor types are not complete for model nodes
                            title += child.data;
                        }
                    }

                    newToc.push({
                        id: `heading-${index}`,
                        title,
                        level
                    });
                    index++;
                }
            }

            setToc(newToc);
        } catch (error) {
            console.error('Error updating table of contents:', error);
        }
    };

    // Function to scroll to heading
    const scrollToHeading = (id: string) => {
        const headings = document.querySelectorAll('.ck-content h1, .ck-content h2, .ck-content h3, .ck-content h4, .ck-content h5, .ck-content h6');
        const index = parseInt(id.split('-')[1]);
        if (headings[index]) {
            headings[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

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
            <div className="editor-layout">
                <div className="toc-panel" ref={tocRef}>
                    <h3 className="toc-title">Table of Contents</h3>
                    <div className="toc-content">
                        {toc.map((item) => (
                            <div
                                key={item.id}
                                className={`toc-item level-${item.level}`}
                                onClick={() => scrollToHeading(item.id)}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="editor-content">
                    {isMounted && (
                        <CKEditor
                            editor={DecoupledEditor}
                            data="<h1>Welcome to the Editor</h1><p>Start typing your content here...</p>"
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
                                },
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
                                ]
                            }}
                            onReady={(editor: Editor) => {
                                const toolbarElement = editor.ui.view.toolbar.element;
                                if (editorToolbarRef.current && toolbarElement) {
                                    editorToolbarRef.current.appendChild(toolbarElement);
                                }
                                setEditorInstance(editor);
                                updateTableOfContents(editor);
                            }}
                            onChange={(event, editor: Editor) => {
                                updateTableOfContents(editor);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
