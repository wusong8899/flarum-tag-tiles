import { Splide } from '@splidejs/splide';
import app from 'flarum/forum/app';
import * as DOMUtils from '../utils/dom-utils';
import { isMobileDevice } from '../utils/mobile-detection';
import { ARRAY_CONSTANTS, ADVANCED_SPLIDE_CONFIG } from '../../common/config/constants';
import { defaultConfig } from '../../common/config';
import { getAdvancedSplideConfig } from '../utils/config-reader';
import type { TagData } from '../../common/config/types';

/**
 * Tag Tiles Manager for converting TagTiles to splide layout
 */
export class TagTilesManager {

    /**
     * Change category layout to splide-based layout
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
            const container = this.createTagSplideContainer();
            if (!container) {
                return;
            }

            const splide = this.createTagSplide(container);
            if (!splide) {
                return;
            }

            const list = this.createTagSplideList(splide);
            if (!list) {
                return;
            }

            this.populateTagSlides(list, tagTiles);
            this.appendTagContainer(container);
            this.addTagSplideContent(container);
            this.removeOriginalTagTiles();
            this.setupMobileStyles();
            this.initializeTagSplide();

            // Notify other extensions that the tags layout has changed
            this.notifyTagsLayoutChanged();
        } catch {
            // Silently handle tag processing errors
        }
    }

    /**
     * Create tag splide container
     */
    private createTagSplideContainer(): HTMLElement {
        const container = DOMUtils.createElement('div', {
            className: 'splideTagContainer',
            id: defaultConfig.ui.tagContainerId
        });

        const textContainer = DOMUtils.createElement('div', {
            className: 'TagTextOuterContainer'
        });

        DOMUtils.appendChild(container, textContainer);
        return container;
    }

    /**
     * Create tag splide element
     */
    private createTagSplide(container: HTMLElement): HTMLElement {
        const splide = DOMUtils.createElement('div', {
            className: 'splide tagSplide'
        });

        // Append splide directly to the main container, not inside text container
        DOMUtils.appendChild(container, splide);

        return splide;
    }

    /**
     * Create tag splide track and list
     */
    private createTagSplideList(splide: HTMLElement): HTMLElement {
        const track = DOMUtils.createElement('div', {
            className: 'splide__track'
        });

        const list = DOMUtils.createElement('ul', {
            className: 'splide__list',
            id: defaultConfig.ui.tagWrapperId
        });

        DOMUtils.appendChild(track, list);
        DOMUtils.appendChild(splide, track);
        return list;
    }

    /**
     * Populate tag slides in the splide list
     */
    private populateTagSlides(list: HTMLElement, tagTiles: NodeListOf<Element>): void {
        const isMobile = isMobileDevice();

        for (const tag of tagTiles) {
            const tagElement = tag as HTMLElement;
            const tagData = this.extractTagData(tagElement);

            if (tagData) {
                const slide = this.createTagSlide(tagData, isMobile);
                DOMUtils.appendChild(list, slide);
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
        const slide = DOMUtils.createElement('li', {
            className: 'splide__slide splide__slide-tag'
        });

        let innerClass = 'splide__slide-tag-inner';
        if (isMobile) {
            innerClass = 'splide__slide-tag-inner-mobile';
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
    private addTagSplideContent(container: HTMLElement): void {
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
     * Initialize tag splide with advanced configuration
     */
    private initializeTagSplide(): void {
        const advancedConfig = getAdvancedSplideConfig();

        setTimeout(() => {
            try {
                // Check if we have enough slides for loop mode
                const slides = document.querySelectorAll('.tagSplide .splide__slide');
                const hasEnoughSlides = slides.length >= advancedConfig.minSlidesForLoop;

                // Determine if we should enable loop mode
                const shouldEnableLoop = advancedConfig.enableLoopMode && hasEnoughSlides;

                // Configure autoplay - Enable autoplay if we have at least 2 slides and autoplay is enabled
                let autoplayConfig: object | false = false;
                const shouldEnableAutoplay = advancedConfig.enableAutoplay && slides.length >= ADVANCED_SPLIDE_CONFIG.MIN_SLIDES_FOR_AUTOPLAY;

                if (shouldEnableAutoplay) {
                    autoplayConfig = {
                        interval: advancedConfig.autoplayInterval,
                        pauseOnHover: advancedConfig.pauseOnMouseEnter,
                    };
                }

                // Note: Splide.js doesn't have freeMode like Swiper.js, so we skip this configuration

                // Configure slides per view based on device
                const isMobile = isMobileDevice();
                const MOBILE_PER_PAGE = 3.5;
                const DEFAULT_PER_PAGE = 1;
                let perPageValue = DEFAULT_PER_PAGE;
                if (isMobile) {
                    perPageValue = MOBILE_PER_PAGE;
                }

                // Determine slide type
                let slideType: 'loop' | 'slide' = 'slide';
                if (shouldEnableLoop) {
                    slideType = 'loop';
                }

                // Configure autoplay
                let autoplaySettings: { interval: number; pauseOnHover: boolean } | false = false;
                if (autoplayConfig) {
                    autoplaySettings = {
                        interval: advancedConfig.autoplayInterval,
                        pauseOnHover: advancedConfig.pauseOnMouseEnter
                    };
                }

                const splideInstance = new Splide('.tagSplide', {
                    perPage: perPageValue,
                    gap: advancedConfig.gap,
                    type: slideType,
                    autoplay: autoplaySettings,
                    speed: advancedConfig.transitionSpeed,
                    drag: advancedConfig.enableGrabCursor,
                    focus: ARRAY_CONSTANTS.EMPTY_LENGTH, // Start from the first slide
                    pagination: false,
                    arrows: true
                });

                splideInstance.mount();

                // Store splide instance for potential cleanup
                if (splideInstance) {
                    // Splide initialized successfully
                    // Debug: Log splide initialization
                    if (process.env.NODE_ENV === 'development') {
                        // Development logging would go here
                    }
                }
            } catch {
                // Silently handle Splide initialization errors
            }
        }, ADVANCED_SPLIDE_CONFIG.SPLIDE_INIT_DELAY);
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
                    layoutType: 'splide'
                }
            });
            document.dispatchEvent(event);
        } catch {
            // Silently handle event dispatch errors
        }
    }
}
