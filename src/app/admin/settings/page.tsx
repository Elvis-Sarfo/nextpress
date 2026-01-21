import { Settings, Globe, Palette, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your NextPress installation
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <section className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5" />
            <h2 className="text-xl font-semibold">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                defaultValue="NextPress"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                rows={2}
                defaultValue="A modern content management system"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium mb-2">
                Site URL
              </label>
              <input
                type="url"
                id="siteUrl"
                defaultValue="https://example.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Localization Settings */}
        <section className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Localization</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="defaultLocale" className="block text-sm font-medium mb-2">
                Default Locale
              </label>
              <select
                id="defaultLocale"
                defaultValue="en"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English (en)</option>
                <option value="fr">French (fr)</option>
                <option value="de">German (de)</option>
                <option value="es">Spanish (es)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Enabled Locales</label>
              <div className="flex flex-wrap gap-2">
                {['en', 'fr', 'de', 'es'].map((locale) => (
                  <label key={locale} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={locale === 'en' || locale === 'fr'}
                      className="rounded"
                    />
                    <span className="text-sm">{locale}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="theme" value="light" />
                  <span className="text-sm">Light</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="theme" value="dark" defaultChecked />
                  <span className="text-sm">Dark</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="theme" value="system" />
                  <span className="text-sm">System</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Security Settings */}
        <section className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Require approval for new comments</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Enable CSRF protection</span>
              </label>
            </div>
          </div>
        </section>

        {/* Database Settings */}
        <section className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Database</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Database: PostgreSQL
            </p>
            <p className="text-sm text-muted-foreground">
              Connected: Yes
            </p>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
