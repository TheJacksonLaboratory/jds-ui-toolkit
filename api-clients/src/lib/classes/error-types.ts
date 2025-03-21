export class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "FatalError";
    }
  }
  
  export class RetriableError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "RetirableError";
    }
  }