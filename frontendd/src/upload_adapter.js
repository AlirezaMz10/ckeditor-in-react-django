class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.url = 'http://127.0.0.1:8000/app/upload/';
  }

  upload() {
    return this.loader.file.then(file => new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('upload', file);

      fetch(this.url, {
        method: 'POST',
        body: data

      })
        .then((response) => response.json())
        .then(response => {
          if (response.url) {
            resolve({
              default: response.url
            });
          } else {
            reject(response.error ? response.error.message : 'An error occurred while uploading the file.');
          }
        })
        .catch(error => {
          reject(error.message);
        });
    }));
  }

  abort() {
    console.log('Wasted...');
  }
}

export default CustomUploadAdapter;