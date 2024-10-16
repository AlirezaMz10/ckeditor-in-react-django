import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from './upload_adapter';
import axios from 'axios';
import { useRef, useEffect } from 'react';
import "./App.css"

const App = () => {
  const txtName = useRef()
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(0)

  const [blogData, setBlogData] = useState({
    en_content: ''
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/app/items/view/").then((res) => {
      setItems(res.data.data)
    })
  }, 0)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCkeditorState = (language, _event, editor) => {
    const data = editor.getData();
    setBlogData((prevState) => ({
      ...prevState,
      [`${language}_content`]: data,
    }));
  };

  const handleContentBeforeLoad = (content) => {
    if (!content) {
      return "";
    }

    const backendBaseURL = 'http://127.0.0.1:8000';
    return content.replace(/src="\/media\/(.*?)"/g, `src="${backendBaseURL}/app/media/$1"`);
  };

  const onEditorInit = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  };

  return (
    <div>
      <input type='text' name='name' ref={txtName} />
      <br />
      <div className="addblog">

        <div>
          <CKEditor
            editor={ClassicEditor}
            data={handleContentBeforeLoad(blogData.en_content)}
            onChange={(event, editor) => handleCkeditorState('en', event, editor)}
            onReady={onEditorInit}
            config={{
              extraPlugins: [CustomUploadAdapter],
              ckfinder: {
                uploadUrl: 'http://127.0.0.1:8000/app/upload/',
              },
            }}
          />
        </div>
        <br />
        <input type='button' onClick={() => {
          console.log({
            name: txtName.current.value,
            description: blogData.en_content,
          })
          if (editing == 0) {
            axios.post("http://127.0.0.1:8000/app/item/create/", {
              name: txtName.current.value,
              description: blogData.en_content,
            }).then((res) => {
              alert(res.data.message)
            })

            setItems([...items, {
              id: items[items.length - 1].id,
              name: txtName.current.value,
              description: blogData.en_content,
            }])
          }else{
            axios.post("http://127.0.0.1:8000/app/item/edit/" + editing + "/", {
              name: txtName.current.value,
              description: blogData.en_content,
            }).then((res) => {
              alert(res.data.message)
            })

            setItems([...items.filter((item)=>item.id!=editing), {
              id: editing,
              name: txtName.current.value,
              description: blogData.en_content,
            }])
          }

          txtName.current.value = ""
          blogData.en_content = ""
        }} value={"submit"} />
        <input type='button' style={{display: editing == true ? "block" : "none"}} onClick={() => {
          setEditing(0)
          txtName.current.value = ""
          blogData.en_content = ""
        }} value={"cancel"}/>
      </div>
      <br />
      <div>
        <table border={1}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td dangerouslySetInnerHTML={{ __html: item.description }} />
                <td><a href='#' onClick={(e) => { e.preventDefault(); setEditing(item.id); blogData.en_content= item.description; txtName.current.value = item.name}}>edit</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;