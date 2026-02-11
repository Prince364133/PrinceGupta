// lib/firebase/firestore.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Get all documents from a collection
 * @param {string} collectionName 
 * @param {Object} options Query options
 * @returns {Promise<Array>}
 */
export const getAllDocuments = async (collectionName, options = {}) => {
    try {
        let q = collection(db, collectionName);

        if (options.where) {
            q = query(q, where(options.where.field, options.where.operator, options.where.value));
        }

        if (options.orderBy) {
            q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
        }

        if (options.limit) {
            q = query(q, limit(options.limit));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error(`Error getting documents from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Get a single document by ID
 * @param {string} collectionName 
 * @param {string} docId 
 * @returns {Promise<Object|null>}
 */
export const getDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        }
        return null;
    } catch (error) {
        console.error(`Error getting document ${docId} from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Create a new document
 * @param {string} collectionName 
 * @param {Object} data 
 * @returns {Promise<string>} Document ID
 */
export const createDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error(`Error creating document in ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Update an existing document
 * @param {string} collectionName 
 * @param {string} docId 
 * @param {Object} data 
 */
export const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error(`Error updating document ${docId} in ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Delete a document
 * @param {string} collectionName 
 * @param {string} docId 
 */
export const deleteDocument = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
        console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Get documents with real-time updates
 * @param {string} collectionName 
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (collectionName, callback) => {
    const q = collection(db, collectionName);
    return onSnapshot(q, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(documents);
    });
};

// Alias for backward compatibility
export const addDocument = createDocument;
