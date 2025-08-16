import { MOBILE_DETECTION, SPLIDE_CONFIG } from '../../common/config/constants';
import type { MobileConfig } from '../../common/config/types';

/**
 * Mobile detection utility functions
 */

/**
 * Check if the current device is mobile
 */
export const isMobileDevice = (): boolean => {
    try {
        const { userAgent } = navigator;
        const mobileIndicator = userAgent.substring(
            MOBILE_DETECTION.USER_AGENT_SUBSTR_START,
            MOBILE_DETECTION.USER_AGENT_SUBSTR_LENGTH
        );
        return mobileIndicator === 'Mobi';
    } catch {
        return false;
    }
};

/**
 * Get splide configuration based on device type
 */
export const getSplideConfig = (): MobileConfig => {
    if (isMobileDevice()) {
        return {
            gap: SPLIDE_CONFIG.MOBILE.GAP,
            perPage: SPLIDE_CONFIG.MOBILE.PER_PAGE,
        };
    }

    return {
        gap: SPLIDE_CONFIG.DESKTOP.GAP,
        perPage: SPLIDE_CONFIG.DESKTOP.PER_PAGE,
    };
};
