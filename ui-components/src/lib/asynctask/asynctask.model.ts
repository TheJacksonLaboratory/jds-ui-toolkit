/**
 * Types specific to the AsyncTasks UI component
 */

import { WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';

/**
 * RunInput interface combines Run and InputReference properties
 */
export interface RunInput {
  /**
   * Optional descriptive name (from InputReference)
   */
  name?: string | null;

  /**
   * Optional detailed description (from InputReference)
   */
  description?: string | null;

  /**
   * Primary key (from Run)
   */
  id: number;

  /**
   * Current execution status from Temporal (from Run)
   */
  status: WorkflowExecutionStatus;
}

export interface Filter {
  name: string;
  options: FilterOption[];
  selectedOptions: FilterOption[];
}

export interface FilterOption {
  label: string;
  value?: string;
}
