import type { DOMElementOptions, StylesObject } from '../../common/config/types';

/**
 * DOM utility functions for safe DOM manipulation
 */

/**
 * Safely query a single element
 */
export const querySelector = (selector: string): Element | null => {
    try {
        return document.querySelector(selector);
    } catch {
        return null;
    }
};

/**
 * Safely query multiple elements
 */
export const querySelectorAll = (selector: string): NodeListOf<Element> => {
    try {
        return document.querySelectorAll(selector);
    } catch {
        return document.querySelectorAll(''); // Returns empty NodeList
    }
};

/**
 * Safely get element by ID
 */
export const getElementById = (id: string): HTMLElement | null => {
    try {
        return document.getElementById(id);
    } catch {
        return null;
    }
};

/**
 * Safely create element with options
 */
export const createElement = (
    tagName: string,
    options: DOMElementOptions = {},
    innerHTML = ''
): HTMLElement => {
    try {
        const element = document.createElement(tagName);
        
        // Set attributes
        for (const [key, value] of Object.entries(options)) {
            if (key === 'className') {
                element.className = String(value);
            } else if (key === 'id') {
                element.id = String(value);
            } else {
                element.setAttribute(key, String(value));
            }
        }
        
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        
        return element;
    } catch {
        return document.createElement('div'); // Fallback
    }
};

/**
 * Safely append child element
 */
export const appendChild = (parent: Element, child: Element): void => {
    try {
        parent.appendChild(child);
    } catch {
        // Silently handle append errors
    }
};

/**
 * Safely prepend child element
 */
export const prependChild = (parent: Element, child: Element): void => {
    try {
        parent.prepend(child);
    } catch {
        // Silently handle prepend errors
    }
};

/**
 * Safely remove element
 */
export const removeElement = (element: Element): void => {
    try {
        element.remove();
    } catch {
        // Silently handle removal errors
    }
};

/**
 * Safely set styles on element
 */
export const setStyles = (element: HTMLElement, styles: StylesObject): void => {
    try {
        for (const [property, value] of Object.entries(styles)) {
            element.style.setProperty(property, String(value));
        }
    } catch {
        // Silently handle style errors
    }
};
