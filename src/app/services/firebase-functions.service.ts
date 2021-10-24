import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, addDoc, collection, getDocs, onSnapshot, doc } from 'firebase/firestore';

/**
 * This service provides the firebase functions you normally import from firebse,
 * so that for testing services using those functions you can mock them.
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseFunctionsService {
  // auth
  getAuth = getAuth;
  GoogleAuthProvider = GoogleAuthProvider;
  signInWithPopup = signInWithPopup;

  // firestore
  getFirestore = getFirestore;
  addDoc = addDoc;
  collection = collection;
  getDocs = getDocs;
  onSnapshot = onSnapshot;
  doc = doc;

  constructor() { }
}
