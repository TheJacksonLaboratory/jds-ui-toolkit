/**
 * AsyncTask Service Models
 * 
 * This module contains TypeScript interfaces for the AsyncTask service API.
 * These models are based on the OpenAPI specification and represent the
 * core entities used in the AsyncTask workflow system.
 */

/**
 * Represents the current execution status of a workflow.
 * Based on temporalio.api.enums.v1.WorkflowExecutionStatus
 */
export enum WorkflowExecutionStatus {
  RUNNING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELED = 4,
  TERMINATED = 5,
  CONTINUED_AS_NEW = 6,
  TIMED_OUT = 7
}

/**
 * Represents a configuration of input parameters for a workflow run.
 */
export interface Input {
  /**
   * Auto-generated primary key
   */
  id?: number | null;
  
  /**
   * Type of the input
   */
  type?: string | null;
  
  /**
   * Foreign key to the user who created this input
   */
  owner_id: number;
  
  /**
   * JSON dictionary containing input parameters
   */
  values: Record<string, any>;
  
  /**
   * Optional descriptive name
   */
  name?: string | null;
  
  /**
   * Optional detailed description
   */
  description?: string | null;
}

/**
 * Lightweight reference to an input configuration.
 * Used for list endpoints to minimize data transfer.
 */
export interface InputReference {
  /**
   * Input identifier
   */
  id: number;
  
  /**
   * Optional descriptive name
   */
  name?: string | null;
  
  /**
   * Optional detailed description
   */
  description?: string | null;
}

/**
 * Input submission for creating a new workflow run
 */
export interface InputSubmission {
    /**
     * Optional descriptive name
     */
    name?: string | null;
    
    /**
     * Optional detailed description
     */
    description?: string | null;
    
    /**
     * Type of task to execute
     */
    task_type: string;
    
    /**
     * Input values specific to the task type
     */
    values: Record<string, any> | string;
  }
  

/**
 * Represents output data from a completed workflow run.
 */
export interface Result {
  /**
   * Auto-generated primary key
   */
  id: number;
  
  /**
   * Foreign key to the associated run
   */
  run_id: number;
  
  /**
   * JSON dictionary containing result data
   */
  values: Record<string, any>;
  
  /**
   * Optional descriptive name
   */
  name?: string | null;
  
  /**
   * Optional detailed description
   */
  description?: string | null;
}

/**
 * Lightweight reference to a result.
 * Used for list endpoints to minimize data transfer.
 */
export interface ResultReference {
  /**
   * Result identifier
   */
  id: number;
  
  /**
   * Associated run identifier
   */
  run_id: number;
  
  /**
   * Optional descriptive name
   */
  name?: string | null;
  
  /**
   * Optional detailed description
   */
  description?: string | null;
}

/**
 * Represents an execution instance of a workflow.
 */
export interface Run {
  /**
   * Auto-generated primary key
   */
  id: number;
  
  /**
   * Foreign key to the input configuration
   */
  input_id: number;
  
  /**
   * Foreign key to the user who initiated the run
   */
  owner_id: number;
  
  /**
   * Temporal workflow identifier
   */
  workflow_id: string;
  
  /**
   * Current execution status from Temporal
   */
  status: WorkflowExecutionStatus;
}
