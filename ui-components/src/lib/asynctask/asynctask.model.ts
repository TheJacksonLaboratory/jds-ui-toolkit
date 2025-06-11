/**
 * Types specific to the AsyncTasks UI component
 */

import { WorkflowExecutionStatus } from '@jax-data-science-demo/api-clients';

/**
 * The RunInput type combines properties from the Run and InputReference types
 */
export interface RunInput {
  // primary key (from Run)
  id: number;

  // optional descriptive name (from InputReference)
  name?: string | null;

  // optional detailed description (from InputReference)
  description?: string | null;

  // current execution status (from Run)
  status: WorkflowExecutionStatus;

  // optional message
  message?: string | null;
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
