import { routes as authenticationRoutes } from './authentication';
import { routes as walletRoutes } from './wallet';

export const routes = [...authenticationRoutes, ...walletRoutes];
