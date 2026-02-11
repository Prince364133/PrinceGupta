// lib/firebase/analytics.js
import { logEvent } from 'firebase/analytics';
import { analytics } from './config';

/**
 * Track page view
 * @param {string} pageName 
 * @param {string} pageTitle 
 */
export const trackPageView = async (pageName, pageTitle) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'page_view', {
                page_name: pageName,
                page_title: pageTitle,
                page_location: window.location.href,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track button click
 * @param {string} buttonName 
 * @param {string} location 
 */
export const trackButtonClick = async (buttonName, location) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'button_click', {
                button_name: buttonName,
                location,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track form submission
 * @param {string} formName 
 * @param {string} formType 
 */
export const trackFormSubmission = async (formName, formType = 'contact') => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'form_submission', {
                form_name: formName,
                form_type: formType,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track custom event
 * @param {string} eventName 
 * @param {Object} params 
 */
export const trackCustomEvent = async (eventName, params = {}) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, eventName, params);
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track project view
 * @param {string} projectId 
 * @param {string} projectName 
 */
export const trackProjectView = async (projectId, projectName) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'project_view', {
                project_id: projectId,
                project_name: projectName,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track resume download
 * @param {string} resumeId 
 * @param {string} resumeTitle 
 */
export const trackResumeDownload = async (resumeId, resumeTitle) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'resume_download', {
                resume_id: resumeId,
                resume_title: resumeTitle,
                timestamp: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track blog read
 * @param {string} blogId 
 * @param {string} blogTitle 
 * @param {number} readingTime 
 */
export const trackBlogRead = async (blogId, blogTitle, readingTime = 0) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'blog_read', {
                blog_id: blogId,
                blog_title: blogTitle,
                reading_time: readingTime,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track search
 * @param {string} searchTerm 
 * @param {string} searchType 
 */
export const trackSearch = async (searchTerm, searchType = 'general') => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'search', {
                search_term: searchTerm,
                search_type: searchType,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

/**
 * Track social media click
 * @param {string} platform 
 * @param {string} location 
 */
export const trackSocialClick = async (platform, location) => {
    try {
        const analyticsInstance = await analytics;
        if (analyticsInstance) {
            logEvent(analyticsInstance, 'social_click', {
                platform,
                location,
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
};
