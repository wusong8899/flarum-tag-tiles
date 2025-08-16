import app from 'flarum/forum/app';
import { defaultConfig } from '../../common/config';
import type { AdvancedSplideConfig } from '../../common/config/types';

const EXTENSION_ID = 'wusong8899-tag-tiles';

/**
 * Safely read a forum attribute if available
 */
const getForumAttribute = (key: string): unknown => {
    try {
        const forum = app && app.forum;
        const attrFn = forum && forum.attribute;
        if (typeof attrFn === 'function') {
            return attrFn.call(forum, key);
        }
        return;
    } catch {
        return;
    }
};

/**
 * Get a setting value with fallback to default
 */
const getSetting = <TValue>(settingKey: string, defaultValue: TValue): TValue => {
    const value = getForumAttribute(`${EXTENSION_ID}.${settingKey}`);
    const BOOLEAN_TRUE_VALUE = 1;

    if (typeof value !== 'undefined' && value !== null) {
        // Handle boolean conversion
        if (typeof defaultValue === 'boolean') {
            return (value === true || value === '1' || value === BOOLEAN_TRUE_VALUE) as TValue;
        }
        // Handle number conversion
        if (typeof defaultValue === 'number') {
            const numValue = Number(value);
            if (Number.isNaN(numValue)) {
                return defaultValue;
            }
            return numValue as TValue;
        }
        // Return as-is for other types
        return value as TValue;
    }
    return defaultValue;
};

/**
 * Get advanced splide configuration from Flarum settings
 */
export const getAdvancedSplideConfig = (): AdvancedSplideConfig => {
    const defaults = defaultConfig.tagTiles.advanced;

    return {
        minSlidesForLoop: getSetting('AdvancedSplideMinSlidesForLoop', defaults.minSlidesForLoop),
        enableAutoplay: getSetting('AdvancedSplideEnableAutoplay', defaults.enableAutoplay),
        autoplayInterval: getSetting('AdvancedSplideAutoplayInterval', defaults.autoplayInterval),
        enableLoopMode: getSetting('AdvancedSplideEnableLoopMode', defaults.enableLoopMode),
        transitionSpeed: getSetting('AdvancedSplideTransitionSpeed', defaults.transitionSpeed),
        gap: getSetting('AdvancedSplideGap', defaults.gap),
        pauseOnMouseEnter: getSetting('AdvancedSplidePauseOnMouseEnter', defaults.pauseOnMouseEnter),
        enableGrabCursor: getSetting('AdvancedSplideEnableGrabCursor', defaults.enableGrabCursor),
        enableFreeMode: getSetting('AdvancedSplideEnableFreeMode', defaults.enableFreeMode),
    };
};
