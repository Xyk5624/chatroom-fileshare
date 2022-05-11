import axios from 'axios';
import config from '../config/config';
var url = config.url + "/client"

export function postSession(data = {}, callback) {
  axios.post(url + '/session', data).then(response => {
    callback(response)
  }).catch(error => {
    alert(error)
  })
}

export function deleteSession(callback, errorhandle) {
  axios.delete(url + '/session', {}).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getPossword(param, callback, errorhandle) {
  axios.get(url + '/password', {
    params: param
  }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function putPassword(data, callback, errorhandle) {
  axios.put(url + '/password', data).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postFiles(data, configs, callback, errorhandle) {
  axios.post(url + '/files', data, configs).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getFiles(params = {}, callback, errorhandle) {
  axios.get(url + '/files', { params: params }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function deleteFiles(data = {}, callback, errorhandle) {
  axios.delete(url + '/files', { data: data }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function downloadFiles(requesturl, fileName, errorhandle) {
  axios.get(requesturl, {
    responseType: 'blob',//必填
  })
    .then(res => {

      if (res) {
        //eslint-disable-next-line
        const blob = new Blob([res.data]);
        //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
        //IE10以上支持blob但是依然不支持download
        if ('download' in document.createElement('a')) {
          //支持a标签download的浏览器
          const link = document.createElement('a')//创建a标签
          link.download = fileName//a标签添加属性
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()//执行下载
          URL.revokeObjectURL(link.href) //释放url
          document.body.removeChild(link)//释放标签

        } else {
          navigator.msSaveBlob(blob, fileName)
        }
      }
    })
    .catch((error) => {
      if (error.response.status == '403') {
        errorhandle()
      } else if (error.response.status == '404') {
        alert("请求的文件已经被删除")
      }else {
        alert(error)
      }
    });
}

export function postGroups(data, callback, errorhandle) {
  axios.post(url + '/groups', data).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getGroups(params = {}, callback, errorhandle) {
  axios.get(url + '/groups', { params: params }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function deleteGroups(data = {}, callback, errorhandle) {
  axios.delete(url + '/groups', { data: data }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getGroupUser(groupid, callback, errorhandle) {
  axios.get(url + '/group/' + groupid + '/users').then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postGroupUser(groupid, data, callback, errorhandle) {
  axios.post(url + '/group/' + groupid + '/users', data).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function deleteGroupUser(groupid, data = {}, callback, errorhandle) {
  axios.delete(url + '/group/' + groupid + '/users', { data: data }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postGroupFiles(groupid, data, configs, callback, errorhandle) {
  axios.post(url + '/group/'+ groupid +'/files', data, configs).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getGroupFiles(groupid, params = {}, callback, errorhandle) {
  axios.get(url + '/group/'+ groupid +'/files', { params: params }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function deleteGroupFiles(groupid, data = {}, callback, errorhandle) {
  axios.delete(url + '/group/'+ groupid +'/files', { data: data }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getUserExisted(params = {}, callback, errorhandle) {
  axios.get(url + '/existeduser', { params: params }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postChat(data = {}, callback, errorhandle) {
  axios.post(url + '/chat', data).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}


export function getChat(params = {}, callback, errorhandle) {
  axios.get(url + '/chat', { params: params }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postChatFiles(chatid, data, configs, callback, errorhandle) {
  axios.post(url + '/chat/'+ chatid +'/files', data, configs).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postGroupChatFiles(groupid, data, configs, callback, errorhandle) {
  axios.post(url + '/group/'+ groupid +'/chat/files', data, configs).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}


export function postGroupChat(groupid, data = {}, callback, errorhandle) {
  axios.post(url + '/group/'+ groupid +'/chat', data).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}


export function getGroupChat(groupid, callback, errorhandle) {
  axios.get(url + '/group/'+ groupid +'/chat').then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function getFriends(callback, errorhandle) {
  axios.get(url + '/friends').then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postFriends(data, callback, errorhandle) {
  axios.post(url + '/friends', data).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}


export function deleteFriends(data = {}, callback, errorhandle) {
  axios.delete(url + '/friends', { data: data }).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}


export function getUser(params = {}, callback, errorhandle) {
  axios.get(url + '/user', {params: params}).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function putAvatar(data, configs, callback, errorhandle) {
  axios.put(url + '/user', data, configs).then(response => {
    callback(response)
  }).catch(error => {
    console.log(error.response.status)
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}