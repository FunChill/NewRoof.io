import { newroofConfig } from './sites/newroof';
import type { SiteConfig } from '../types/site';

// Future: switch based on domain or env variable
// import { blackkitchenConfig } from './sites/blackkitchen';
// import { outdoorkitchenConfig } from './sites/outdoorkitchen';
// const configs: Record<string, SiteConfig> = { ... };

export const siteConfig: SiteConfig = newroofConfig;
