import app from 'flarum/admin/app';
import type { ExtensionData } from '../common/config/types';

/**
 * Settings generator utility for TagTiles admin interface
 */
export class SettingsGenerator {
    private extensionId: string;
    private extensionData: ExtensionData;

    constructor(extensionId: string) {
        this.extensionId = extensionId;
        this.extensionData = app.extensionData.for(extensionId) as ExtensionData;
    }

    /**
     * Register social media settings
     */
    registerSocialMediaSettings(): this {
        const socialPlatforms = ['Kick', 'Facebook', 'Twitter', 'YouTube', 'Instagram'];

        for (const platform of socialPlatforms) {
            // URL setting
            this.extensionData.registerSetting({
                setting: `${this.extensionId}.Social${platform}Url`,
                type: 'url',
                label: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}Url`)),
                help: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}UrlHelp`)),
            });

            // Icon setting
            this.extensionData.registerSetting({
                setting: `${this.extensionId}.Social${platform}Icon`,
                type: 'text',
                label: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}Icon`)),
                help: String(app.translator.trans(`wusong8899-tag-tiles.admin.Social${platform}IconHelp`)),
            });
        }

        return this;
    }

    /**
     * Register advanced swiper configuration settings
     */
    registerAdvancedSwiperSettings(): this {
        // Minimum slides for loop mode
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperMinSlidesForLoop`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperMinSlidesForLoop')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperMinSlidesForLoopHelp')),
        });

        // Enable autoplay
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperEnableAutoplay`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableAutoplay')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableAutoplayHelp')),
        });

        // Autoplay delay
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperAutoplayDelay`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperAutoplayDelay')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperAutoplayDelayHelp')),
        });

        // Enable loop mode
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperEnableLoopMode`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableLoopMode')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableLoopModeHelp')),
        });

        // Transition speed
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperTransitionSpeed`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperTransitionSpeed')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperTransitionSpeedHelp')),
        });

        // Space between slides
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperSpaceBetween`,
            type: 'number',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperSpaceBetween')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperSpaceBetweenHelp')),
        });

        // Pause on mouse enter
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperPauseOnMouseEnter`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperPauseOnMouseEnter')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperPauseOnMouseEnterHelp')),
        });

        // Enable grab cursor
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperEnableGrabCursor`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableGrabCursor')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableGrabCursorHelp')),
        });

        // Enable free mode
        this.extensionData.registerSetting({
            setting: `${this.extensionId}.AdvancedSwiperEnableFreeMode`,
            type: 'boolean',
            label: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableFreeMode')),
            help: String(app.translator.trans('wusong8899-tag-tiles.admin.AdvancedSwiperEnableFreeModeHelp')),
        });

        return this;
    }

    /**
     * Register all settings for the extension
     */
    registerAllSettings(): this {
        return this
            .registerSocialMediaSettings()
            .registerAdvancedSwiperSettings();
    }
}

/**
 * Configuration constants
 */
export const EXTENSION_CONFIG = {
    EXTENSION_ID: 'wusong8899-tag-tiles',
};

/**
 * Initialize admin settings
 * @param extensionId - The extension identifier
 */
export const initializeAdminSettings = (
    extensionId = EXTENSION_CONFIG.EXTENSION_ID
): void => {
    const generator = new SettingsGenerator(extensionId);
    generator.registerAllSettings();
};
