import app from 'flarum/forum/app';
import { defaultConfig } from '../../common/config';

/**
 * Configuration manager for the TagTiles extension
 */
export class ConfigManager {
    private static instance: ConfigManager;

    private constructor() {
        // Private constructor for singleton pattern
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    /**
     * Check if current page is tags page
     */
    public isTagsPage(): boolean {
        try {
            const currentRoute = app.current.get('routeName');
            return currentRoute === 'tags';
        } catch {
            // Fallback: check URL
            try {
                return globalThis.location.pathname.includes('/tags');
            } catch {
                return false;
            }
        }
    }

    /**
     * Get extension configuration
     */
    public getConfig(): typeof defaultConfig {
        return defaultConfig;
    }

    /**
     * Check if extension is properly configured
     */
    public isConfigured(): boolean {
        try {
            // Check if at least one social media platform is configured
            const socialPlatforms = ['Kick', 'Facebook', 'Twitter', 'YouTube', 'Instagram'];

            for (const platform of socialPlatforms) {
                const url = app.forum.attribute(`${defaultConfig.app.extensionId}.Social${platform}Url`);
                const icon = app.forum.attribute(`${defaultConfig.app.extensionId}.Social${platform}Icon`);

                if (url && icon) {
                    return true;
                }
            }

            return false;
        } catch {
            return false;
        }
    }
}
