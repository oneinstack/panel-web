//to fix js-token issue for electron so replace js-cookie to localStorage
//detail to look https://bbs.csdn.net/topics/397963088
import { encode, decode } from 'js-base64';

const TokenKey = 'Admin-Token'
export function getToken() {
  return localStorage.getItem(TokenKey) ? decode(localStorage.getItem(TokenKey)) : localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, encode("Bearer " + token))
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
