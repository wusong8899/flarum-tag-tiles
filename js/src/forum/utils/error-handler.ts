import { ERROR_HANDLING } from '../../common/config/constants';
import type { ErrorLogEntry } from '../../common/config/types';

/**
 * Error handling utility for the TagTiles extension
 */
export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorLog: ErrorLogEntry[] = [];
    private isInitialized = false;

    private constructor() {}

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
    public handleSync<T>(fn: () => T, context: string): T | undefined {
        try {
            return fn();
        } catch (error) {
            this.logError(error as Error, context);
            return undefined;
        }
    }

    /**
     * Handle asynchronous errors
     */
    public async handleAsync<T>(fn: () => Promise<T>, context: string): Promise<T | undefined> {
        try {
            return await fn();
        } catch (error) {
            this.logError(error as Error, context);
            return undefined;
        }
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
                console.warn(`[TagTiles] Error in ${context}:`, error);
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
            window.addEventListener('unhandledrejection', (event) => {
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
