/**
 * Shared Interfaces
 *
 * Framework-agnostic interfaces that define contracts between
 * the legacy codebase and domain-driven implementations.
 */

/**
 * Flow Repository Interface
 * Defines the contract for persisting and retrieving flows.
 * Implementations can use JSON files, SQL databases, or external APIs.
 */
export interface IFlowRepository {
    /**
     * Save a flow
     * @param flowId - Unique identifier for the flow
     * @param flowData - The flow data to persist
     */
    saveFlow(flowId: string, flowData: any): Promise<void>

    /**
     * Retrieve a flow by ID
     * @param flowId - Unique identifier for the flow
     * @returns The flow data, or undefined if not found
     */
    getFlow(flowId: string): Promise<any | undefined>

    /**
     * List all flows
     * @returns Array of flow metadata
     */
    listFlows(): Promise<
        Array<{
            id: string
            name: string
            [key: string]: any
        }>
    >

    /**
     * Delete a flow
     * @param flowId - Unique identifier for the flow
     */
    deleteFlow(flowId: string): Promise<void>
}

/**
 * Authentication Provider Interface
 * Defines the contract for authentication strategies.
 */
export interface IAuthProvider {
    /**
     * Initialize the authentication provider
     */
    initialize(): Promise<void>

    /**
     * Authenticate a user
     * @param credentials - User credentials
     * @returns Authentication result with user information
     */
    authenticate(credentials: any): Promise<{
        user: any
        token?: string
    }>

    /**
     * Verify an authentication token
     * @param token - Authentication token
     * @returns User information if token is valid
     */
    verifyToken(token: string): Promise<any | null>
}

/**
 * Feature Management Interface
 * Defines the contract for feature flagging and subsetting.
 */
export interface IFeatureManager {
    /**
     * Check if a feature is enabled
     * @param featureName - Name of the feature
     * @param context - Optional context (user, tenant, etc.)
     * @returns True if the feature is enabled
     */
    isFeatureEnabled(featureName: string, context?: any): boolean

    /**
     * Get all enabled features for a context
     * @param context - Optional context (user, tenant, etc.)
     * @returns Array of enabled feature names
     */
    getEnabledFeatures(context?: any): string[]
}

/**
 * Logger Interface
 * Defines the contract for logging across different environments.
 * Enterprise implementations can forward logs to custom telemetry systems.
 */
export interface ILogger {
    /**
     * Log informational message
     * @param message - Log message
     * @param meta - Optional metadata
     */
    info(message: string, meta?: any): void

    /**
     * Log warning message
     * @param message - Log message
     * @param meta - Optional metadata
     */
    warn(message: string, meta?: any): void

    /**
     * Log error message
     * @param message - Log message
     * @param meta - Optional metadata or error object
     */
    error(message: string, meta?: any): void

    /**
     * Log debug message
     * @param message - Log message
     * @param meta - Optional metadata
     */
    debug(message: string, meta?: any): void
}
