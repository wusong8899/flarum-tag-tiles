import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import TagsPage from 'flarum/tags/components/TagsPage';

import { TagTilesManager } from './components/tag-tiles-manager';
import { AdSlideshowManager } from './components/ad-slideshow-manager';
import { ErrorHandler } from './utils/error-handler';
import { ConfigManager } from './utils/config-manager';
import { defaultConfig } from '../common/config';

/**
 * Main extension initializer for TagTiles
 */
app.initializers.add(defaultConfig.app.extensionId, () => {
    const errorHandler = ErrorHandler.getInstance();
    const configManager = ConfigManager.getInstance();

    // Initialize error handling
    if (!errorHandler.initialize()) {
        return;
    }

    const tagTilesManager = new TagTilesManager();
    const adSlideshowManager = new AdSlideshowManager();

    // Extend TagsPage to setup UI components when the page loads
    extend(TagsPage.prototype, 'oncreate', function tagsPageOnCreateExtension(_vnode: unknown) {
        errorHandler.handleSync(() => {
            if (configManager.isTagsPage()) {
                // Force UI components setup
                const DOM_READY_DELAY = 100;
                setTimeout(() => {
                    // Create advertisement slideshow first (appears at top)
                    adSlideshowManager.createAdSlideshow();
                    
                    // Then create tag tiles layout
                    tagTilesManager.changeCategoryLayout();
                }, DOM_READY_DELAY);
            }
        }, 'TagsPage oncreate extension');
    });

    extend(TagsPage.prototype, 'onupdate', function tagsPageOnUpdateExtension(_vnode: unknown) {
        errorHandler.handleSync(() => {
            // Check if containers don't exist and create them
            const tagContainerExists = document.getElementById(defaultConfig.ui.tagContainerId);
            const adContainerExists = document.getElementById(defaultConfig.ui.adContainerId);
            
            if (!tagContainerExists || !adContainerExists) {
                const DOM_READY_DELAY = 100;
                setTimeout(() => {
                    // Recreate missing components
                    if (!adContainerExists) {
                        adSlideshowManager.createAdSlideshow();
                    }
                    if (!tagContainerExists) {
                        tagTilesManager.changeCategoryLayout();
                    }
                }, DOM_READY_DELAY);
            }
        }, 'TagsPage onupdate extension');
    });
});
