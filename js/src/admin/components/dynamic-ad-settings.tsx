import app from 'flarum/admin/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import type { AdData } from '../../common/config/types';

interface DynamicAdSettingsComponentAttrs {
  extensionId: string;
}

/**
 * Dynamic component for managing advertisement settings with add/delete functionality
 */
export default class DynamicAdSettingsComponent extends Component<DynamicAdSettingsComponentAttrs> {
  private ads: AdData[] = [];
  private loading = false;
  private nextId = 1;
  private saveTimeouts: Record<string, NodeJS.Timeout> = {};

  oninit(vnode: any) {
    super.oninit(vnode);
    this.loadExistingAds();
  }

  /**
   * Load existing ads from settings
   */
  private loadExistingAds(): void {
    const { extensionId } = this.attrs;
    const ads: AdData[] = [];
    
    // Load existing ads from settings (check up to 100 slots for maximum flexibility)
    for (let i = 1; i <= 100; i++) {
      const linkKey = `${extensionId}.AdLink${i}`;
      const imageKey = `${extensionId}.AdImage${i}`;
      const link = app.data.settings[linkKey] || '';
      const image = app.data.settings[imageKey] || '';
      
      // Only include ads that have at least image filled
      if (image) {
        ads.push({
          id: i,
          link,
          image
        });
        this.nextId = Math.max(this.nextId, i + 1);
      }
    }
    
    this.ads = ads;
    
    // If no ads exist, add one empty ad to start with
    if (ads.length === 0) {
      this.addAd();
    }
  }

  /**
   * Add a new advertisement
   */
  private addAd(): void {
    const newAd: AdData = {
      id: this.nextId++,
      link: '',
      image: ''
    };
    
    this.ads.push(newAd);
    m.redraw();
  }

  /**
   * Remove an advertisement
   */
  private removeAd(adId: number): void {
    const { extensionId } = this.attrs;
    const adIndex = this.ads.findIndex(ad => ad.id === adId);
    
    if (adIndex === -1) return;
    
    const ad = this.ads[adIndex];
    
    // Remove from backend
    this.saveSetting(`${extensionId}.AdLink${ad.id}`, '');
    this.saveSetting(`${extensionId}.AdImage${ad.id}`, '');
    
    // Remove from local state
    this.ads.splice(adIndex, 1);
    
    // Ensure at least one ad exists for configuration
    if (this.ads.length === 0) {
      this.addAd();
    }
    
    m.redraw();
  }

  /**
   * Update advertisement data
   */
  private updateAd(adId: number, field: 'link' | 'image', value: string): void {
    const { extensionId } = this.attrs;
    const ad = this.ads.find(a => a.id === adId);
    
    if (!ad) return;
    
    ad[field] = value;
    
    // Save to backend
    const settingKey = field === 'link' 
      ? `${extensionId}.AdLink${ad.id}` 
      : `${extensionId}.AdImage${ad.id}`;
    
    this.saveSetting(settingKey, value);
  }

  /**
   * Save setting to backend with debouncing
   */
  private saveSetting(key: string, value: string): void {
    // Clear existing timeout for this key
    if (this.saveTimeouts[key]) {
      clearTimeout(this.saveTimeouts[key]);
    }
    
    // Set new timeout
    this.saveTimeouts[key] = setTimeout(() => {
      app.data.settings[key] = value;
      
      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/settings',
        body: {
          [key]: value
        }
      }).catch(() => {
        // Handle save error silently for now
        // In a production app, you might want to show an error notification
      });

      // Clean up timeout reference
      delete this.saveTimeouts[key];
    }, 500);
  }

  /**
   * Preview advertisement image
   */
  private previewImage(imageUrl: string): void {
    if (!imageUrl) return;
    
    // Simple image preview in a new window
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head><title>Advertisement Preview</title></head>
          <body style="margin:0;padding:20px;text-align:center;background:#f5f5f5;">
            <h3>Advertisement Preview</h3>
            <img src="${imageUrl}" style="max-width:100%;max-height:80vh;border:1px solid #ddd;border-radius:4px;" />
          </body>
        </html>
      `);
    }
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    if (!url) return true; // Empty URL is valid (optional field)
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  view() {
    const { extensionId } = this.attrs;
    
    return (
      <div className="Form-group">
        <label className="FormLabel">
          {app.translator.trans('wusong8899-tag-tiles.admin.AdSettings')}
        </label>
        <div className="helpText">
          {app.translator.trans('wusong8899-tag-tiles.admin.AdSettingsHelp')}
        </div>

        <div className="DynamicAdSettings">
          {/* Ads list */}
          {this.ads.map((ad, index) => this.renderAd(ad, index))}
          
          {/* Add button */}
          <div className="DynamicAdSettings-addButton" style={{ marginTop: '15px' }}>
            <Button
              className="Button Button--primary"
              icon="fas fa-plus"
              onclick={() => this.addAd()}
            >
              {app.translator.trans('wusong8899-tag-tiles.admin.AddAd')}
            </Button>
          </div>

          {/* Global ads toggle */}
          <div className="Form-group" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e8e8e8' }}>
            <div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={app.data.settings[`${extensionId}.EnableAds`] === '1'}
                  onchange={(e: Event) => {
                    const target = e.target as HTMLInputElement;
                    this.saveSetting(`${extensionId}.EnableAds`, target.checked ? '1' : '0');
                  }}
                />
                {app.translator.trans('wusong8899-tag-tiles.admin.EnableAds')}
              </label>
              <div className="helpText">
                {app.translator.trans('wusong8899-tag-tiles.admin.EnableAdsHelp')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render a single advertisement
   */
  private renderAd(ad: AdData, index: number) {
    const isImageValid = ad.image && this.isValidUrl(ad.image);
    const isLinkValid = this.isValidUrl(ad.link);

    return (
      <div className="DynamicAdSettings-ad" key={ad.id} style={{ 
        border: '1px solid #ddd', 
        borderRadius: '6px', 
        padding: '15px', 
        marginBottom: '15px',
        backgroundColor: '#f9f9f9'
      }}>
        <div className="DynamicAdSettings-adHeader" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h4 style={{ margin: 0 }}>
            {app.translator.trans('wusong8899-tag-tiles.admin.AdNumber', { number: index + 1 })}
          </h4>
          <div>
            {ad.image && (
              <Button
                className="Button Button--primary"
                icon="fas fa-eye"
                onclick={() => this.previewImage(ad.image)}
                style={{ marginRight: '8px' }}
              >
                {app.translator.trans('wusong8899-tag-tiles.admin.PreviewAd')}
              </Button>
            )}
            <Button
              className="Button Button--danger"
              icon="fas fa-trash"
              onclick={() => this.removeAd(ad.id)}
              disabled={this.ads.length === 1}
            >
              {app.translator.trans('wusong8899-tag-tiles.admin.DeleteAd')}
            </Button>
          </div>
        </div>
        
        <div className="DynamicAdSettings-adFields">
          {/* Image URL field */}
          <div className="Form-group">
            <label className="FormLabel">
              {app.translator.trans('wusong8899-tag-tiles.admin.AdImage')} *
            </label>
            <input
              className={`FormControl ${!isImageValid ? 'error' : ''}`}
              type="url"
              placeholder="https://example.com/ad-image.jpg"
              value={ad.image}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.updateAd(ad.id, 'image', target.value);
              }}
            />
            {!isImageValid && ad.image && (
              <div className="helpText error">
                {app.translator.trans('wusong8899-tag-tiles.admin.InvalidImageUrl')}
              </div>
            )}
          </div>
          
          {/* Link URL field */}
          <div className="Form-group">
            <label className="FormLabel">
              {app.translator.trans('wusong8899-tag-tiles.admin.AdLink')}
            </label>
            <input
              className={`FormControl ${!isLinkValid ? 'error' : ''}`}
              type="url"
              placeholder="https://example.com (optional)"
              value={ad.link}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.updateAd(ad.id, 'link', target.value);
              }}
            />
            {!isLinkValid && ad.link && (
              <div className="helpText error">
                {app.translator.trans('wusong8899-tag-tiles.admin.InvalidLinkUrl')}
              </div>
            )}
            <div className="helpText">
              {app.translator.trans('wusong8899-tag-tiles.admin.AdLinkHelp')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Clean up timeouts when component is removed
   */
  onremove(): void {
    // Clear all pending timeouts
    Object.values(this.saveTimeouts).forEach(timeout => {
      clearTimeout(timeout);
    });
    this.saveTimeouts = {};
  }
}