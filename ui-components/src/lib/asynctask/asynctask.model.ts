import { TemplateRef } from '@angular/core';

/**
 * AsyncTasks UI component specific model.
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

export interface IAsyncTableConfig {
  isExpandable: boolean;
  defaultExpandedRows?: Record<string, boolean>;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  isPaginated?: boolean;
  isStriped?: boolean;
  showActions: boolean;
  allowFilters: boolean;
  // an HTML template for the body of the expandable row - to work properly,
  // the template must be resolved in ngAfterViewInit of the component that
  // creates the config object
  detailsTemplate?: TemplateRef<null>;
}