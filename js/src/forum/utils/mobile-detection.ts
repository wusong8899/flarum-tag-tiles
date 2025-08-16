import { MOBILE_DETECTION, SWIPER_CONFIG } from '../../common/config/constants';
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
 * Get swiper configuration based on device type
 */
export const getSwiperConfig = (): MobileConfig => {
    if (isMobileDevice()) {
        return {
            spaceBetween: SWIPER_CONFIG.MOBILE.SPACE_BETWEEN,
            slidesPerView: SWIPER_CONFIG.MOBILE.SLIDES_PER_VIEW,
        };
    }

    return {
        spaceBetween: SWIPER_CONFIG.DESKTOP.SPACE_BETWEEN,
        slidesPerView: SWIPER_CONFIG.DESKTOP.SLIDES_PER_VIEW,
    };
};
