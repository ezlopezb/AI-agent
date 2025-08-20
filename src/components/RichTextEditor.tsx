// QuillEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import the Quill styles

const QuillEditor: React.FC = () => {
  const [editorHtml, setEditorHtml] = useState<string>('');
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            ['clean'], // remove formatting button
          ],
        },
      });

      quillInstance.current.on('text-change', () => {
        setEditorHtml(quillInstance.current?.root.innerHTML || '');
      });
    }
  }, []);

  return (
    <div>
      <div ref={quillRef} style={{ height: '400px' }} />
      <div style={{ marginTop: '20px' }}>
        <h3>Actions:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
      </div>
    </div>
  );
};

export default QuillEditor;