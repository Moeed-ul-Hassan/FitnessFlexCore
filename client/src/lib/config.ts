export interface BrandConfig {
  clientId: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  backgroundUrl?: string;
  customCss?: string;
}

export const DEFAULT_CONFIG: BrandConfig = {
  clientId: 'default',
  brandName: 'GYMISCTIC',
  primaryColor: '#10b981',
  secondaryColor: '#60a5fa',
  accentColor: '#8b5cf6',
};

export function getBrandConfig(): BrandConfig {
  // In a real app, this would fetch from API based on domain/client
  const storedConfig = localStorage.getItem('brandConfig');
  if (storedConfig) {
    return { ...DEFAULT_CONFIG, ...JSON.parse(storedConfig) };
  }
  return DEFAULT_CONFIG;
}

export function setBrandConfig(config: Partial<BrandConfig>): void {
  const currentConfig = getBrandConfig();
  const newConfig = { ...currentConfig, ...config };
  localStorage.setItem('brandConfig', JSON.stringify(newConfig));
  
  // Apply CSS variables
  applyBrandStyles(newConfig);
}

export function applyBrandStyles(config: BrandConfig): void {
  const root = document.documentElement;
  
  // Convert hex to HSL for CSS variables
  root.style.setProperty('--gym-primary', config.primaryColor);
  root.style.setProperty('--gym-secondary', config.secondaryColor);
  root.style.setProperty('--gym-accent', config.accentColor);
  
  // Apply custom CSS if provided
  if (config.customCss) {
    let styleElement = document.getElementById('custom-brand-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-brand-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = config.customCss;
  }
}

export function getClientId(): string {
  // In a real app, this would be determined by the domain or subdomain
  return new URL(window.location.href).hostname.split('.')[0] || 'default';
}

export function isWhiteLabelEnabled(): boolean {
  return process.env.NODE_ENV === 'production' && getClientId() !== 'default';
}

export function getAppName(): string {
  if (isWhiteLabelEnabled()) {
    return getBrandConfig().brandName;
  }
  return 'GYMISCTIC';
}

export function getAppColors() {
  const config = getBrandConfig();
  return {
    primary: config.primaryColor,
    secondary: config.secondaryColor,
    accent: config.accentColor,
  };
}

// Initialize brand config on app load
export function initializeBrandConfig(): void {
  const config = getBrandConfig();
  applyBrandStyles(config);
}

// White-label specific utilities
export function generateCustomManifest(config: BrandConfig): any {
  return {
    name: config.brandName,
    short_name: config.brandName,
    start_url: "/",
    display: "standalone",
    theme_color: config.primaryColor,
    background_color: "#0f172a",
    icons: [
      {
        src: config.logoUrl || "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: config.logoUrl || "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}

export function updatePageTitle(title?: string): void {
  const appName = getAppName();
  document.title = title ? `${title} - ${appName}` : appName;
}
