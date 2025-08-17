import app from 'flarum/admin/app';
import { initializeAdminSettings } from './settings-generator';
import DynamicAdSettingsComponent from './components/dynamic-ad-settings';

app.initializers.add('wusong8899-tag-tiles', (): void => {
    initializeAdminSettings();
    
    // Register the dynamic ad settings component
    app.extensionData
        .for('wusong8899-tag-tiles')
        .registerSetting(() => {
            return m(DynamicAdSettingsComponent, {
                extensionId: 'wusong8899-tag-tiles'
            });
        });
});
