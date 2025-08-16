import { ERROR_HANDLING } from '../../common/config/constants';
import type { ErrorLogEntry } from '../../common/config/types';

/**
 * Error handling utility for the TagTiles extension
 */
export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorLog: ErrorLogEntry[] = [];
    private isInitialized = false;

    private constructor() {
        // Private constructor for singleton pattern
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    /**
     * Initialize error handler
     */
    public initialize(): boolean {
        try {
            if (this.isInitialized) {
                return true;
            }

            // Set up global error handling
            this.setupGlobalErrorHandling();
            this.isInitialized = true;
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Handle synchronous errors
     */
    public handleSync<TResult>(callback: () => TResult, context: string): TResult | void {
        try {
            return callback();
        } catch (error) {
            this.logError(error as Error, context);
            return;
        }
    }

    /**
     * Handle asynchronous errors
     */
    public handleAsync<TResult>(callback: () => Promise<TResult>, context: string): Promise<TResult | void> {
        return callback().catch((error) => {
            this.logError(error as Error, context);
            return;
        });
    }

    /**
     * Log error with context
     */
    private logError(error: Error, context: string): void {
        try {
            const entry: ErrorLogEntry = {
                timestamp: new Date(),
                error,
                context,
            };

            this.errorLog.push(entry);

            // Keep log size manageable
            if (this.errorLog.length > ERROR_HANDLING.MAX_ERROR_LOG_ENTRIES) {
                this.errorLog.shift();
            }

            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                // Development logging is handled elsewhere
            }
        } catch {
            // Silently handle logging errors
        }
    }

    /**
     * Set up global error handling
     */
    private setupGlobalErrorHandling(): void {
        try {
            // Handle unhandled promise rejections
            globalThis.addEventListener('unhandledrejection', (event) => {
                this.logError(
                    new Error(String(event.reason)),
                    'Unhandled Promise Rejection'
                );
            });
        } catch {
            // Silently handle setup errors
        }
    }

    /**
     * Get error log (for debugging)
     */
    public getErrorLog(): ErrorLogEntry[] {
        return [...this.errorLog];
    }

    /**
     * Clear error log
     */
    public clearErrorLog(): void {
        this.errorLog = [];
    }
}
