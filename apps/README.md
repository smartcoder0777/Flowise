# Apps - Orchestration Entry Points

This directory contains dedicated entry points that compose the application by injecting specific adapters at startup.

## Structure

-   `oss-app/`: Open Source Edition entry point (✅ implemented)
-   `workday-app/`: Workday Enterprise Edition entry point (to be implemented)

## Purpose

Each app entry point:

1. Initializes the EnterpriseRegistry
2. Registers enterprise-specific adapters (if applicable)
3. Bootstraps the legacy server with appropriate shims
4. Starts the application

## OSS App

The `oss-app` is the Open Source Edition entry point that:

-   Initializes the EnterpriseRegistry (empty for OSS, ready for future extensibility)
-   Initializes the database connection via legacy server's DataSource
-   Starts the Flowise server application
-   Handles graceful shutdown

### Usage

```bash
# Build the oss-app
cd apps/oss-app
pnpm build

# Start the application
pnpm start

# Or from the root
pnpm start
```

The app layer orchestrates the composition, allowing different entry points (OSS vs Enterprise) to inject different adapters and configurations without modifying the legacy core.
