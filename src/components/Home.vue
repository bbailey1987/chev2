<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </label>
      <button v-on:click="submitFile()">Submit</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { constants } from 'fs';
import FileUpload from 'vue-upload-component';

export default {
    name: 'Home',
    components: {
        FileUpload
    },
    data () {
        return {
            rows: [],
            contractor: {},
            files: [],
            edit: false,
            file: ''
        }
    },
    created () {
        //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        // Send the user's data in this post request after retrieving it from Microsoft
        console.log('this.$adal.user', this.$adal.user);
        axios.post('http://localhost:3000/api/auth/login/', this.$adal.user)
            .then(response => {
                console.log('RESPONSE', response);
                localStorage.setItem('jwtToken', response.data.token);
                axios.defaults.headers.common['Authorization'] = response.data.token;
                axios.get('http://localhost:3000/datasource')
                    .then(res => {
                        console.log('DATASOURCE RESPONSE', res);
                    });
                //this.$router.push()
            })
            .catch(e => {
                console.log('api/auth/login error', e);
                this.errors.push(e);
            });
    },
    methods: {
        submitFile(){
        /*
                Initialize the form data
            */
            let formData = new FormData();

            /*
                Add the form data we need to submit
            */
            formData.append('file', this.file);

        /*
          Make the request to the POST /single-file URL
        */
            axios.post( '/datasource',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      },

      /*
        Handles a change on the file upload
      */
      handleFileUpload(){
        this.file = this.$refs.file.files[0];
      },
        inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.alert('Your choice is not a picture')
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    },
    inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true
        })
      }
      if (!newFile && oldFile) {
        this.edit = false
      }
    },
    editSave() {
      
      const file = this.files[0];
      console.log('this.$refs.upload', this.$refs.upload);
      const formData = new FormData();
      // TODO: instead of using 'file' as the key, use the identity of the user
      formData.append('file', file);
      formData.append('key', 'value');
      console.log('file', file);
      console.log('formData', formData);
      axios.post('/datasource', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              })
        .then(response => {
            console.log('response', response);
        });
      /*this.edit = false
      let binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1])
      let arr = new Uint8Array(binStr.length)
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i)
      }
      let file = new File([arr], oldFile.name, { type: oldFile.type })
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true,
      })*/
    }
    }
}
</script>
