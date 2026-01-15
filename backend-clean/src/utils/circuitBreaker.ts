// Circuit Breaker Pattern - Prevents cascading failures
export class CircuitBreaker {
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5, // Failures before opening circuit
    private timeout: number = 60000, // Time before attempting recovery (1 minute)
    private successThreshold: number = 2 // Successes needed to close circuit
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker entering HALF_OPEN state');
      } else {
        console.warn('Circuit breaker is OPEN, using fallback');
        if (fallback) {
          return await fallback();
        }
        throw new Error('Circuit breaker is OPEN and no fallback provided');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        console.warn('Operation failed, using fallback');
        return await fallback();
      }
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log('Circuit breaker CLOSED after successful recovery');
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      console.error(`Circuit breaker OPEN after ${this.failureCount} failures`);
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
    console.log('Circuit breaker manually reset');
  }
}

// Circuit breakers for different services
export const circuitBreakers = {
  stripe: new CircuitBreaker(5, 60000, 2),
  nowpayments: new CircuitBreaker(5, 60000, 2),
  alchemy: new CircuitBreaker(5, 60000, 2),
  database: new CircuitBreaker(3, 30000, 2),
  email: new CircuitBreaker(5, 120000, 2),
  sms: new CircuitBreaker(5, 120000, 2),
};
