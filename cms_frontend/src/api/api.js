import axios from 'axios';

var url = "http://localhost:3000/cms"

export function getUsers(params = {}, callback, errorhandle) {
  axios.get(url + '/users', {
    params: params
  }).then(response => {
    callback(response)
  }).catch(error => {
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function postUsers(data = {}, callback, errorhandle) {
  axios.post(url + '/users', data).then(response => {
    callback(response)
  }).catch(error => {
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

export function putUsers(data = {}, callback, errorhandle) {
  axios.put(url + '/users', data).then(response => {
    callback(response)
  }).catch(error => {
    if (error.response.status == '403') {
      errorhandle()
    } else {
       alert(error)
    }
  })
}

export function deleteUsers(data = {}, callback, errorhandle) {
  axios.delete(url + '/users', { data: data }).then(response => {
    callback(response)
  }).catch(error => {
    if (error.response.status == '403') {
      errorhandle()
    } else {
      alert(error)
    }
  })
}

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