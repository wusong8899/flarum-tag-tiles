import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import app from 'flarum/forum/app';
import * as DOMUtils from '../utils/dom-utils';
import { isMobileDevice } from '../utils/mobile-detection';
import { ARRAY_CONSTANTS, ADVANCED_SWIPER_CONFIG } from '../../common/config/constants';
import { defaultConfig } from '../../common/config';
import { getAdvancedSwiperConfig } from '../utils/config-reader';
import type { TagData } from '../../common/config/types';

/**
 * Tag Tiles Manager for converting TagTiles to swiper layout
 */
export class TagTilesManager {

    /**
     * Change category layout to swiper-based layout
     */
    changeCategoryLayout(): void {
        try {
            if (DOMUtils.getElementById(defaultConfig.ui.tagContainerId)) {
                return; // Already exists
            }

            // Try immediate processing first
            const tagTiles = DOMUtils.querySelectorAll(".TagTile");
            if (tagTiles.length > ARRAY_CONSTANTS.EMPTY_LENGTH) {
                this.processTagTiles(tagTiles);
            } else {
                // If no TagTiles found immediately, wait and retry
                this.waitForTagTilesAndProcess();
            }
        } catch {
            // Silently handle category layout errors
        }
    }

    /**
     * Wait for TagTiles to be available and process them
     */
    private waitForTagTilesAndProcess(): void {
        const maxAttempts = 10;
        const attemptInterval = 200;
        let attempts = 0;

        const checkAndProcess = (): void => {
            attempts += ARRAY_CONSTANTS.NEXT_ITEM_OFFSET;
            const tagTiles = DOMUtils.querySelectorAll(".TagTile");

            if (tagTiles.length > ARRAY_CONSTANTS.EMPTY_LENGTH) {
                // TagTiles found, process them
                this.processTagTiles(tagTiles);
            } else if (attempts < maxAttempts) {
                // TagTiles not found yet, try again
                setTimeout(checkAndProcess, attemptInterval);
            }
            // If max attempts reached and no TagTiles found, silently fail
        };

        checkAndProcess();
    }

    /**
     * Process the found TagTiles
     */
    private processTagTiles(tagTiles: NodeListOf<Element>): void {
        try {
            const container = this.createTagSwiperContainer();
            if (!container) {
                return;
            }

            const swiper = this.createTagSwiper(container);
            if (!swiper) {
                return;
            }

            const wrapper = this.createTagSwiperWrapper(swiper);
            if (!wrapper) {
                return;
            }

            this.populateTagSlides(wrapper, tagTiles);
            this.appendTagContainer(container);
            this.addTagSwiperContent(container);
            this.removeOriginalTagTiles();
            this.setupMobileStyles();
            this.initializeTagSwiper();

            // Notify other extensions that the tags layout has changed
            this.notifyTagsLayoutChanged();
        } catch {
            // Silently handle tag processing errors
        }
    }

    /**
     * Create tag swiper container
     */
    private createTagSwiperContainer(): HTMLElement {
        const container = DOMUtils.createElement('div', {
            className: 'swiperTagContainer',
            id: defaultConfig.ui.tagContainerId
        });

        const textContainer = DOMUtils.createElement('div', {
            className: 'TagTextOuterContainer'
        });

        DOMUtils.appendChild(container, textContainer);
        return container;
    }

    /**
     * Create tag swiper element
     */
    private createTagSwiper(container: HTMLElement): HTMLElement {
        const swiper = DOMUtils.createElement('div', {
            className: 'swiper tagSwiper'
        });

        // Append swiper directly to the main container, not inside text container
        DOMUtils.appendChild(container, swiper);

        return swiper;
    }

    /**
     * Create tag swiper wrapper
     */
    private createTagSwiperWrapper(swiper: HTMLElement): HTMLElement {
        const wrapper = DOMUtils.createElement('div', {
            className: 'swiper-wrapper',
            id: defaultConfig.ui.tagWrapperId
        });
        DOMUtils.appendChild(swiper, wrapper);
        return wrapper;
    }

    /**
     * Populate tag slides
     */
    private populateTagSlides(wrapper: HTMLElement, tagTiles: NodeListOf<Element>): void {
        const isMobile = isMobileDevice();

        for (const tag of tagTiles) {
            const tagElement = tag as HTMLElement;
            const tagData = this.extractTagData(tagElement);

            if (tagData) {
                const slide = this.createTagSlide(tagData, isMobile);
                DOMUtils.appendChild(wrapper, slide);
            }
        }
    }

    /**
     * Extract tag data from DOM element
     */
    private extractTagData(tag: HTMLElement): TagData | void {
        const linkElement = tag.querySelector('a') as HTMLAnchorElement;
        const nameElement = tag.querySelector('.TagTile-name') as HTMLElement;
        const descElement = tag.querySelector('.TagTile-description') as HTMLElement;

        if (!linkElement || !nameElement) {
            return;
        }

        // Get background from flarum-tag-background plugin or fallback to computed style
        const backgroundImage = this.getTagBackgroundImage(linkElement.href, tag);
        const computedStyle = globalThis.getComputedStyle(tag);
        const background = backgroundImage || computedStyle.background;

        let description = '';
        let descColor = '';
        if (descElement) {
            description = descElement.textContent || '';
            descColor = globalThis.getComputedStyle(descElement).color;
        }

        return {
            url: linkElement.href,
            background: background,
            name: nameElement.textContent || '',
            nameColor: globalThis.getComputedStyle(nameElement).color,
            description,
            descColor
        };
    }

    /**
     * Get tag background image from flarum-tag-background plugin
     */
    private getTagBackgroundImage(tagUrl: string, tagElement: HTMLElement): string | void {
        try {
            // Extract tag slug from URL
            const url = new URL(tagUrl, globalThis.location.origin);
            const parts = url.pathname.split('/').filter(Boolean);
            const tIndex = parts.indexOf('t');
            const tagsIndex = parts.indexOf('tags');

            let slug = '';

            if (tIndex !== ARRAY_CONSTANTS.NOT_FOUND_INDEX && parts[tIndex + ARRAY_CONSTANTS.NEXT_ITEM_OFFSET]) {
                slug = parts[tIndex + ARRAY_CONSTANTS.NEXT_ITEM_OFFSET];
            } else if (tagsIndex !== ARRAY_CONSTANTS.NOT_FOUND_INDEX && parts[tagsIndex + ARRAY_CONSTANTS.NEXT_ITEM_OFFSET]) {
                slug = parts[tagsIndex + ARRAY_CONSTANTS.NEXT_ITEM_OFFSET];
            } else if (parts.length > ARRAY_CONSTANTS.EMPTY_LENGTH) {
                slug = parts[parts.length + ARRAY_CONSTANTS.LAST_ITEM_OFFSET]; // Get the last part of the URL
            }

            if (!slug) {
                return;
            }

            // Get background URL using the same logic as flarum-tag-background
            const bgUrl = this.getTagBackgroundUrlBySlug(slug);

            if (bgUrl) {
                return `url(${bgUrl})`;
            }

            return;
        } catch {
            // Fallback to checking inline styles set by flarum-tag-background
            const inlineBackground = tagElement.style.background;
            if (inlineBackground && inlineBackground.includes('url(')) {
                return inlineBackground;
            }
            return;
        }
    }

    /**
     * Get tag background URL by slug - shared logic with flarum-tag-background
     */
    private getTagBackgroundUrlBySlug(slug: string): string | void {
        try {
            // Get tag from Flarum store
            const tags = app.store.all('tags') as unknown[];
            const tagModel = tags.find((tagItem: unknown) => {
                const tagRecord = tagItem as Record<string, unknown>;
                let tagSlug = '';

                if (typeof tagRecord.slug === 'function') {
                    tagSlug = tagRecord.slug();
                } else if (tagRecord.attribute && typeof tagRecord.attribute === 'function') {
                    tagSlug = tagRecord.attribute('slug');
                }

                return tagSlug === slug;
            });

            if (!tagModel) {
                return;
            }

            // Get background URL from tag model
            const tagRecord = tagModel as Record<string, unknown>;

            if (tagRecord.attribute && typeof tagRecord.attribute === 'function') {
                const bgUrl = tagRecord.attribute('wusong8899BackgroundURL');
                if (bgUrl) {
                    return bgUrl;
                }
            }

            return;
        } catch {
            return;
        }
    }

    /**
     * Create individual tag slide
     */
    private createTagSlide(tagData: TagData, isMobile: boolean): HTMLElement {
        const slide = DOMUtils.createElement('div', {
            className: 'swiper-slide swiper-slide-tag'
        });

        let innerClass = 'swiper-slide-tag-inner';
        if (isMobile) {
            innerClass = 'swiper-slide-tag-inner-mobile';
        }

        const backgroundStyle = `background:${tagData.background};background-size: cover;background-position: center;background-repeat: no-repeat;`;

        // Check if there's a background image (from flarum-tag-background plugin)
        const hasBackgroundImage = this.hasBackgroundImage(tagData.background);

        // If there's a background image, hide the text; otherwise show it
        let textContent = '';
        if (!hasBackgroundImage) {
            textContent = `
            <div style='font-weight:bold;font-size:14px;color:${tagData.nameColor}'>
                ${tagData.name}
            </div>
        `;
        }

        slide.innerHTML = `
            <a href='${tagData.url}'>
                <div class='${innerClass}' style='${backgroundStyle}'>
                    ${textContent}
                </div>
            </a>
        `;

        return slide;
    }

    /**
     * Check if background contains an image URL
     */
    private hasBackgroundImage(background: string): boolean {
        if (!background) {
            return false;
        }

        // Check if background contains url() function
        return background.includes('url(') && !background.includes('url()');
    }

    /**
     * Append tag container to DOM
     */
    private appendTagContainer(container: HTMLElement): void {
        const contentElement = DOMUtils.querySelector("#content .container .TagsPage-content");
        if (contentElement) {
            DOMUtils.prependChild(contentElement, container);
        }
    }

    /**
     * Add additional content to tag container
     */
    private addTagSwiperContent(container: HTMLElement): void {
        const textContainer = container.querySelector('.TagTextOuterContainer');
        if (textContainer) {
            const titleElement = DOMUtils.createElement('div', {
                className: 'TagTextContainer'
            }, "<div class='TagTextIcon'></div>中文玩家社区资讯");

            DOMUtils.prependChild(textContainer, titleElement);

            const socialButtons = this.createSocialButtonsHTML();
            textContainer.insertAdjacentHTML('beforeend', socialButtons);
        }
    }

    /**
     * Create social buttons HTML
     */
    private createSocialButtonsHTML(): string {
        const { extensionId } = defaultConfig.app;

        // Define social media platforms with their settings keys and default icons
        const socialPlatforms = [
            {
                urlKey: `${extensionId}.SocialKickUrl`,
                iconKey: `${extensionId}.SocialKickIcon`,
                defaultIcon: ''
            },
            {
                urlKey: `${extensionId}.SocialFacebookUrl`,
                iconKey: `${extensionId}.SocialFacebookIcon`,
                defaultIcon: ''
            },
            {
                urlKey: `${extensionId}.SocialTwitterUrl`,
                iconKey: `${extensionId}.SocialTwitterIcon`,
                defaultIcon: ''
            },
            {
                urlKey: `${extensionId}.SocialYouTubeUrl`,
                iconKey: `${extensionId}.SocialYouTubeIcon`,
                defaultIcon: ''
            },
            {
                urlKey: `${extensionId}.SocialInstagramUrl`,
                iconKey: `${extensionId}.SocialInstagramIcon`,
                defaultIcon: ''
            }
        ];

        // Generate social buttons HTML
        const socialButtons = socialPlatforms
            .map((platform, index) => {
                const url = app.forum.attribute(platform.urlKey) || '';
                const iconUrl = app.forum.attribute(platform.iconKey) || platform.defaultIcon;

                // Only render button if both URL and icon are provided
                if (!url.trim() || !iconUrl.trim()) {
                    return '';
                }

                let marginStyle = '';
                if (index > ARRAY_CONSTANTS.FIRST_INDEX) {
                    marginStyle = 'margin-left: 20px;';
                }
                return `<img onClick="window.open('${url}', '_blank')" style="width: 32px;${marginStyle}" src="${iconUrl}">`;
            })
            .filter(button => button !== '') // Remove empty buttons
            .join('');

        // Only render the container if there are social buttons
        if (!socialButtons) {
            return '';
        }

        return `
            <div style="text-align:center;padding-top: 10px;">
                <button class="Button Button--primary" type="button" style="font-weight: normal !important; color:#ffa000; background: #1a1d2e !important;border-radius: 2rem !important;">
                    <div style="margin-top: 5px;" class="Button-label">
                        ${socialButtons}
                    </div>
                </button>
            </div>
        `;
    }

    /**
     * Remove original tag tiles
     */
    private removeOriginalTagTiles(): void {
        const tagTiles = DOMUtils.querySelector(".TagTiles");
        if (tagTiles) {
            DOMUtils.removeElement(tagTiles);
        }
    }

    /**
     * Setup mobile-specific styles
     */
    private setupMobileStyles(): void {
        if (isMobileDevice()) {
            const app = DOMUtils.getElementById("app");
            const appContent = DOMUtils.querySelector(".App-content") as HTMLElement;

            if (app) {
                DOMUtils.setStyles(app, { 'overflow-x': 'hidden' });
            }

            if (appContent) {
                DOMUtils.setStyles(appContent, {
                    'min-height': 'auto',
                    'background': ''
                });
            }
        }
    }

    /**
     * Initialize tag swiper with advanced configuration
     */
    private initializeTagSwiper(): void {
        const advancedConfig = getAdvancedSwiperConfig();

        setTimeout(() => {
            try {
                // Check if we have enough slides for loop mode
                const slides = document.querySelectorAll('.tagSwiper .swiper-slide');
                const hasEnoughSlides = slides.length >= advancedConfig.minSlidesForLoop;

                // Determine if we should enable loop mode
                const shouldEnableLoop = advancedConfig.enableLoopMode && hasEnoughSlides;

                // Configure autoplay - Enable autoplay if we have at least 2 slides and autoplay is enabled
                let autoplayConfig: object | false = false;
                const shouldEnableAutoplay = advancedConfig.enableAutoplay && slides.length >= ADVANCED_SWIPER_CONFIG.MIN_SLIDES_FOR_AUTOPLAY;

                if (shouldEnableAutoplay) {
                    autoplayConfig = {
                        delay: advancedConfig.autoplayDelay,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: advancedConfig.pauseOnMouseEnter,
                        reverseDirection: false,
                        stopOnLastSlide: false,
                        waitForTransition: true,
                    };
                }

                // Adjust freeMode logic - disable freeMode when autoplay is enabled for better compatibility
                const shouldEnableFreeMode = advancedConfig.enableFreeMode && !shouldEnableAutoplay;

                // Configure slides per view based on device
                const isMobile = isMobileDevice();
                const MOBILE_SLIDES_PER_VIEW = 3.5;
                let slidesPerView: number | 'auto' = 'auto';
                if (isMobile) {
                    slidesPerView = MOBILE_SLIDES_PER_VIEW;
                }

                const swiperInstance = new Swiper('.tagSwiper', {
                    slidesPerView: slidesPerView,
                    spaceBetween: advancedConfig.spaceBetween,
                    freeMode: shouldEnableFreeMode,
                    loop: shouldEnableLoop,
                    autoplay: autoplayConfig,
                    speed: advancedConfig.transitionSpeed,
                    grabCursor: advancedConfig.enableGrabCursor,
                    centeredSlides: false, // Disable centered slides to prevent offset
                    watchSlidesProgress: true,
                    initialSlide: 0, // Start from the first slide
                    modules: [Autoplay]
                });

                // Store swiper instance for potential cleanup
                if (swiperInstance) {
                    // Swiper initialized successfully
                    // Debug: Log swiper initialization
                    if (process.env.NODE_ENV === 'development') {
                        // Development logging would go here
                    }
                }
            } catch {
                // Silently handle Swiper initialization errors
            }
        }, ADVANCED_SWIPER_CONFIG.SWIPER_INIT_DELAY);
    }

    /**
     * Notify other extensions that the tags layout has changed
     */
    private notifyTagsLayoutChanged(): void {
        try {
            // Dispatch custom event to notify other extensions
            const event = new CustomEvent('tagsLayoutChanged', {
                detail: {
                    extensionId: defaultConfig.app.extensionId,
                    layoutType: 'swiper'
                }
            });
            document.dispatchEvent(event);
        } catch {
            // Silently handle event dispatch errors
        }
    }
}
