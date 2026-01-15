import { EnterpriseRegistry } from '@flowise/domain-core'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'

/**
 * OSS Application Entry Point
 *
 * This is the Open Source Edition entry point that:
 * 1. Initializes the EnterpriseRegistry (for future extensibility)
 * 2. Starts the legacy Flowise server
 *
 * Note: For Phase 1, we use a simple approach that spawns the legacy server
 * as a child process to avoid import-time side effects. Future phases will
 * refactor the legacy server to be more modular.
 */

let serverProcess: ChildProcess | null = null

async function start(): Promise<void> {
    try {
        console.log('🚀 [oss-app]: Initializing Flowise Open Source Edition...')

        // Initialize EnterpriseRegistry for service locator pattern
        // For OSS edition, we initialize with empty registry
        // Enterprise edition will register enterprise-specific services
        EnterpriseRegistry.initialize()
        console.log('📋 [oss-app]: EnterpriseRegistry initialized')

        // Start the legacy server via bin/dev which uses ts-node
        // Note: Using bin/dev instead of pnpm run start because start requires building
        console.log('⚡️ [oss-app]: Starting Flowise server...')

        const serverPath = path.join(__dirname, '../../../legacy/packages/server')
        const devBinPath = path.join(serverPath, 'bin/dev')

        // Use bin/dev which runs the server with ts-node (no build required)
        serverProcess = spawn(devBinPath, ['start'], {
            cwd: serverPath,
            stdio: 'inherit',
            env: {
                ...process.env
                // Inherit all environment variables
            }
        })

        serverProcess.on('error', (error) => {
            console.error('❌ [oss-app]: Failed to start server process:', error)
            process.exit(1)
        })

        serverProcess.on('exit', (code, signal) => {
            if (code !== 0 && code !== null) {
                console.error(`❌ [oss-app]: Server process exited with code ${code}`)
                process.exit(code)
            }
            if (signal) {
                console.log(`🛑 [oss-app]: Server process killed with signal ${signal}`)
                process.exit(0)
            }
        })

        console.log('✅ [oss-app]: Flowise Open Source Edition started successfully')
    } catch (error) {
        console.error('❌ [oss-app]: Failed to start application:', error)
        process.exit(1)
    }
}

/**
 * Graceful shutdown handler
 */
async function shutdown(): Promise<void> {
    try {
        console.log('🛑 [oss-app]: Shutting down Flowise...')

        if (serverProcess) {
            serverProcess.kill('SIGTERM')

            // Give the process time to shut down gracefully
            await new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    if (serverProcess && !serverProcess.killed) {
                        console.log('⚠️  [oss-app]: Force killing server process...')
                        serverProcess.kill('SIGKILL')
                    }
                    resolve(undefined)
                }, 5000)

                serverProcess?.on('exit', () => {
                    clearTimeout(timeout)
                    resolve(undefined)
                })
            })
        }

        console.log('✅ [oss-app]: Shutdown complete')
        process.exit(0)
    } catch (error) {
        console.error('❌ [oss-app]: Error during shutdown:', error)
        process.exit(1)
    }
}

// Handle graceful shutdown
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ [oss-app]: Uncaught exception:', error)
    shutdown()
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ [oss-app]: Unhandled rejection at:', promise, 'reason:', reason)
    shutdown()
})

// Start the application
start().catch((error) => {
    console.error('❌ [oss-app]: Unhandled error during startup:', error)
    process.exit(1)
})

export { start, shutdown }
