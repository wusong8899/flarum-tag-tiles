import app from 'flarum/forum/app';
import { defaultConfig } from '../../common/config';
import type { AdvancedSwiperConfig } from '../../common/config/types';

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
 * Get advanced swiper configuration from Flarum settings
 */
export const getAdvancedSwiperConfig = (): AdvancedSwiperConfig => {
    const defaults = defaultConfig.tagTiles.advanced;

    return {
        minSlidesForLoop: getSetting('AdvancedSwiperMinSlidesForLoop', defaults.minSlidesForLoop),
        enableAutoplay: getSetting('AdvancedSwiperEnableAutoplay', defaults.enableAutoplay),
        autoplayDelay: getSetting('AdvancedSwiperAutoplayDelay', defaults.autoplayDelay),
        enableLoopMode: getSetting('AdvancedSwiperEnableLoopMode', defaults.enableLoopMode),
        transitionSpeed: getSetting('AdvancedSwiperTransitionSpeed', defaults.transitionSpeed),
        spaceBetween: getSetting('AdvancedSwiperSpaceBetween', defaults.spaceBetween),
        pauseOnMouseEnter: getSetting('AdvancedSwiperPauseOnMouseEnter', defaults.pauseOnMouseEnter),
        enableGrabCursor: getSetting('AdvancedSwiperEnableGrabCursor', defaults.enableGrabCursor),
        enableFreeMode: getSetting('AdvancedSwiperEnableFreeMode', defaults.enableFreeMode),
    };
};
