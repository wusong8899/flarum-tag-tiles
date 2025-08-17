import { Splide } from '@splidejs/splide';
import app from 'flarum/forum/app';
import * as DOMUtils from '../utils/dom-utils';
import { isMobileDevice } from '../utils/mobile-detection';
import { ARRAY_CONSTANTS, ADVANCED_SPLIDE_CONFIG, CSS_CLASSES } from '../../common/config/constants';
import { defaultConfig } from '../../common/config';
import type { AdData } from '../../common/config/types';

/**
 * Advertisement Slideshow Manager for creating splide-based ad carousels
 */
export class AdSlideshowManager {
    private splideInstance: Splide | null = null;
    private container: HTMLElement | null = null;

    /**
     * Initialize and create advertisement slideshow
     */
    createAdSlideshow(): void {
        try {
            // Check if ads are enabled
            if (!this.isAdsEnabled()) {
                return;
            }

            // Check if container already exists
            if (DOMUtils.getElementById(defaultConfig.ui.adContainerId)) {
                return; // Already exists
            }

            // Get ad data from settings
            const adData = this.getAdData();
            if (adData.length === ARRAY_CONSTANTS.EMPTY_LENGTH) {
                return; // No ads configured
            }

            // Create slideshow components
            const container = this.createAdContainer();
            if (!container) {
                return;
            }

            const splide = this.createAdSplide(container);
            if (!splide) {
                return;
            }

            const wrapper = this.createAdWrapper(splide);
            if (!wrapper) {
                return;
            }

            this.populateAdSlides(wrapper, adData);
            this.appendAdContainer(container);
            this.initializeAdSplide();

            // Store container reference
            this.container = container;

            // Notify that ads layout has changed
            this.notifyAdsLayoutChanged();
        } catch {
            // Silently handle ad slideshow creation errors
        }
    }

    /**
     * Check if advertisements are enabled
     */
    private isAdsEnabled(): boolean {
        try {
            const adsEnabled = app.forum.attribute(`${defaultConfig.app.extensionId}.EnableAds`);
            return adsEnabled === true || adsEnabled === '1' || adsEnabled === 'true';
        } catch {
            return defaultConfig.ads.enableAds;
        }
    }

    /**
     * Get advertisement data from forum settings
     */
    private getAdData(): AdData[] {
        const ads: AdData[] = [];
        let index = 1;

        // Keep checking for ads until we find a gap
        while (true) {
            const imageKey = `${defaultConfig.app.extensionId}.AdImage${index}`;
            const linkKey = `${defaultConfig.app.extensionId}.AdLink${index}`;

            const image = app.forum.attribute(imageKey) as string;
            const link = app.forum.attribute(linkKey) as string;

            // If both image and link are empty, check a few more indices before stopping
            if (!image && !link) {
                // Check if we should continue looking (in case of gaps in numbering)
                let foundMore = false;
                for (let lookahead = 1; lookahead <= 3; lookahead++) {
                    const nextImageKey = `${defaultConfig.app.extensionId}.AdImage${index + lookahead}`;
                    const nextLinkKey = `${defaultConfig.app.extensionId}.AdLink${index + lookahead}`;
                    const nextImage = app.forum.attribute(nextImageKey) as string;
                    const nextLink = app.forum.attribute(nextLinkKey) as string;
                    
                    if (nextImage || nextLink) {
                        foundMore = true;
                        break;
                    }
                }
                
                if (!foundMore) {
                    break; // No more ads found
                }
            }

            // Add to ads array if at least image is provided
            if (image) {
                ads.push({
                    id: index,
                    image: image,
                    link: link || ''
                });
            }

            index++;

            // Safety check to prevent infinite loops
            if (index > 100) {
                break;
            }
        }

        return ads;
    }

    /**
     * Create advertisement container
     */
    private createAdContainer(): HTMLElement {
        const container = DOMUtils.createElement('div', {
            className: CSS_CLASSES.AD_CONTAINER,
            id: defaultConfig.ui.adContainerId
        });

        return container;
    }

    /**
     * Create advertisement splide element
     */
    private createAdSplide(container: HTMLElement): HTMLElement {
        const splide = DOMUtils.createElement('div', {
            className: `${CSS_CLASSES.SPLIDE} ${CSS_CLASSES.AD_SPLIDE}`
        });

        DOMUtils.appendChild(container, splide);
        return splide;
    }

    /**
     * Create advertisement splide wrapper
     */
    private createAdWrapper(splide: HTMLElement): HTMLElement {
        const track = DOMUtils.createElement('div', {
            className: CSS_CLASSES.SPLIDE_TRACK
        });

        const wrapper = DOMUtils.createElement('div', {
            className: CSS_CLASSES.SPLIDE_LIST,
            id: defaultConfig.ui.adWrapperId
        });

        DOMUtils.appendChild(track, wrapper);
        DOMUtils.appendChild(splide, track);
        return wrapper;
    }

    /**
     * Populate advertisement slides
     */
    private populateAdSlides(wrapper: HTMLElement, adData: AdData[]): void {
        for (const ad of adData) {
            if (ad.image) {
                const slide = this.createAdSlide(ad);
                DOMUtils.appendChild(wrapper, slide);
            }
        }
    }

    /**
     * Create individual advertisement slide
     */
    private createAdSlide(ad: AdData): HTMLElement {
        const slide = DOMUtils.createElement('div', {
            className: `${CSS_CLASSES.SPLIDE_SLIDE} ${CSS_CLASSES.SPLIDE_SLIDE_AD}`
        });

        const inner = DOMUtils.createElement('div', {
            className: CSS_CLASSES.SPLIDE_SLIDE_AD_INNER
        });

        // Create image element
        const img = DOMUtils.createElement('img') as HTMLImageElement;
        img.src = ad.image;
        img.alt = 'Advertisement';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';

        // Add click handler if link is provided
        if (ad.link) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                try {
                    window.open(ad.link, '_blank');
                } catch {
                    // Silently handle link opening errors
                }
            });
        }

        DOMUtils.appendChild(inner, img);
        DOMUtils.appendChild(slide, inner);

        return slide;
    }

    /**
     * Append advertisement container to DOM
     */
    private appendAdContainer(container: HTMLElement): void {
        const contentElement = DOMUtils.querySelector("#content .container");
        if (contentElement) {
            // Insert at the beginning of content container
            DOMUtils.prependChild(contentElement, container);
        }
    }

    /**
     * Initialize advertisement splide
     */
    private initializeAdSplide(): void {
        setTimeout(() => {
            try {
                const slides = document.querySelectorAll(`.${CSS_CLASSES.AD_SPLIDE} .${CSS_CLASSES.SPLIDE_SLIDE}`);
                
                if (slides.length === ARRAY_CONSTANTS.EMPTY_LENGTH) {
                    return; // No slides to initialize
                }

                const advancedConfig = defaultConfig.ads.advanced;
                
                // Check if we have enough slides for loop mode
                const hasEnoughSlides = slides.length >= advancedConfig.minSlidesForLoop;
                const shouldEnableLoop = advancedConfig.enableLoopMode && hasEnoughSlides;
                
                // Configure autoplay
                const shouldEnableAutoplay = advancedConfig.enableAutoplay && slides.length >= ADVANCED_SPLIDE_CONFIG.MIN_SLIDES_FOR_AUTOPLAY;

                // Configure slides per view based on device and slide count
                const isMobile = isMobileDevice();
                let perPageValue = 1; // Default to 1 for ads
                
                // For multiple ads, show more on desktop
                if (slides.length > 1) {
                    perPageValue = isMobile ? 1 : Math.min(3, slides.length);
                }

                this.splideInstance = new Splide(`.${CSS_CLASSES.AD_SPLIDE}`, {
                    type: shouldEnableLoop ? 'loop' : 'slide',
                    perPage: perPageValue,
                    gap: advancedConfig.gap,
                    autoplay: shouldEnableAutoplay,
                    interval: advancedConfig.autoplayInterval,
                    speed: advancedConfig.transitionSpeed,
                    drag: advancedConfig.enableGrabCursor,
                    focus: ARRAY_CONSTANTS.EMPTY_LENGTH, // Start from the first slide
                    pagination: slides.length > 1, // Show pagination if multiple slides
                    arrows: slides.length > perPageValue, // Show arrows if needed
                    pauseOnHover: advancedConfig.pauseOnMouseEnter,
                    pauseOnFocus: true,
                    resetProgress: false,
                    lazyLoad: 'nearby' // Enable lazy loading for better performance
                });

                this.splideInstance.mount();

                // Debug logging in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Ad slideshow initialized with ${slides.length} slides`);
                }
            } catch {
                // Silently handle Splide initialization errors
            }
        }, ADVANCED_SPLIDE_CONFIG.SPLIDE_INIT_DELAY);
    }

    /**
     * Notify other extensions that ads layout has changed
     */
    private notifyAdsLayoutChanged(): void {
        try {
            const event = new CustomEvent('adsLayoutChanged', {
                detail: {
                    extensionId: defaultConfig.app.extensionId,
                    layoutType: 'splide'
                }
            });
            document.dispatchEvent(event);
        } catch {
            // Silently handle event dispatch errors
        }
    }

    /**
     * Destroy advertisement slideshow
     */
    destroy(): void {
        try {
            if (this.splideInstance) {
                this.splideInstance.destroy();
                this.splideInstance = null;
            }

            if (this.container) {
                DOMUtils.removeElement(this.container);
                this.container = null;
            }
        } catch {
            // Silently handle destruction errors
        }
    }

    /**
     * Refresh advertisement slideshow (useful for dynamic updates)
     */
    refresh(): void {
        this.destroy();
        this.createAdSlideshow();
    }
}