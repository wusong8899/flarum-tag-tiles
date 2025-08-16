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
     * Register all settings for the extension
     */
    registerAllSettings(): this {
        return this.registerSocialMediaSettings();
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
