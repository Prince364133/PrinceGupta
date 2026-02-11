// lib/firebase/auth.js
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object with role
 */
export const loginWithEmail = async (email, password) => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'admin', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'user';

        return {
            uid: user.uid,
            email: user.email,
            role,
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Sign out current user
 */
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

/**
 * Check if user is admin
 * @param {string} uid User ID
 * @returns {Promise<boolean>}
 */
export const isAdmin = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'admin', uid));
        return userDoc.exists() && userDoc.data().role === 'admin';
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const role = await isAdmin(user.uid) ? 'admin' : 'user';
            callback({
                uid: user.uid,
                email: user.email,
                role,
            });
        } else {
            callback(null);
        }
    });
};

/**
 * Get current user
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};
