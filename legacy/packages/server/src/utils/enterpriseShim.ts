/**
 * Enterprise Shim Utilities
 *
 * This module provides shim functions that allow the legacy server
 * to delegate authority to domain-driven implementations via the
 * EnterpriseRegistry service locator pattern.
 *
 * These shims enable:
 * - Enterprise-specific customizations without modifying core logic
 * - Clean separation between OSS and Enterprise code
 * - Ability to sync with upstream Flowise updates without conflicts
 */

import { EnterpriseRegistry } from '@flowise/domain-core'
import type { IFlowRepository, IAuthProvider, IFeatureManager, ILogger } from '@flowise/domain-core'

/**
 * Get the flow repository from EnterpriseRegistry, if registered.
 * Falls back to null for OSS edition.
 *
 * @returns IFlowRepository instance or null
 */
export function getFlowRepository(): IFlowRepository | null {
    return EnterpriseRegistry.get<IFlowRepository>('flowRepository') || null
}

/**
 * Get the authentication provider from EnterpriseRegistry, if registered.
 * Falls back to null for OSS edition.
 *
 * @returns IAuthProvider instance or null
 */
export function getAuthProvider(): IAuthProvider | null {
    return EnterpriseRegistry.get<IAuthProvider>('authProvider') || null
}

/**
 * Get the feature manager from EnterpriseRegistry, if registered.
 * Falls back to null for OSS edition.
 *
 * @returns IFeatureManager instance or null
 */
export function getFeatureManager(): IFeatureManager | null {
    return EnterpriseRegistry.get<IFeatureManager>('featureManager') || null
}

/**
 * Check if a feature is enabled using the feature manager.
 * Returns false if no feature manager is registered (OSS edition).
 *
 * @param featureName - Name of the feature to check
 * @param context - Optional context for feature evaluation
 * @returns True if feature is enabled, false otherwise
 */
export function isFeatureEnabled(featureName: string, context?: any): boolean {
    const featureManager = getFeatureManager()
    if (!featureManager) {
        return false // OSS edition: features disabled by default
    }
    return featureManager.isFeatureEnabled(featureName, context)
}

/**
 * Get the logger from EnterpriseRegistry, if registered.
 * Falls back to null for OSS edition.
 *
 * @returns ILogger instance or null
 */
export function getLogger(): ILogger | null {
    return EnterpriseRegistry.get<ILogger>('logger') || null
}
