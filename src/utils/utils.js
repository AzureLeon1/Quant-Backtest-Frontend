// import Vue from 'vue'
// import storage from '@/utils/storage'
// import { STORAGE_KEY } from '@/utils/constants'
// import myAPI from '@/api'


// function getLanguages () {
//   return new Promise((resolve, reject) => {
//     let languages = storage.get(STORAGE_KEY.languages)
//     if (languages) {
//       resolve(languages)
//     }
//     myAPI.getLanguages().then(res => {
//       let languages = res.data.data.languages
//       storage.set(STORAGE_KEY.languages, languages)
//       resolve(languages)
//     }, err => {
//       reject(err)
//     })
//   })
// }

// export default {
//   getLanguages: getLanguages
// }
