import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CollectionResponse, Response } from '../models/response';
import { AsyncTaskService } from './asynctask.service';

describe('AsyncTaskService', () => {
  let service: AsyncTaskService;
  let httpTestingController: HttpTestingController;
  const defaultBaseUrl = '/asynctask/api';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AsyncTaskService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AsyncTaskService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have default base URL', () => {
    expect(service.getBaseUrl()).toEqual(defaultBaseUrl);
  });

  it('should set base URL correctly with trailing slash', () => {
    service.setBaseUrl('https://example.com/');
    expect(service.getBaseUrl()).toEqual('https://example.com/asynctask/api');
  });

  it('should set base URL correctly without trailing slash', () => {
    service.setBaseUrl('https://example.com');
    expect(service.getBaseUrl()).toEqual('https://example.com/asynctask/api');
  });

  it('should preserve existing path when setting base URL', () => {
    service.setBaseUrl('https://example.com/asynctask/api');
    expect(service.getBaseUrl()).toEqual('https://example.com/asynctask/api');
  });

  // Input methods tests
  describe('Input methods', () => {
    it('should get all inputs', () => {
      const mockResponse: CollectionResponse<any> = { data: [{ id: 1, name: 'Test Input' }] };
      
      service.getInputs().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/inputs`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should add an input', () => {
      const mockInput = { task_type: 'HelloWorld', values: { name: 'Test' } };
      const mockResponse: Response<any> = { object: { id: 1, name: 'Test Input' } };
      
      service.addInput(mockInput).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/inputs`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockInput);
      req.flush(mockResponse);
    });

    it('should get an input by ID', () => {
      const inputId = 1;
      const mockResponse: Response<any> = { object: { id: inputId, name: 'Test Input' } };
      
      service.getInput(inputId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/inputs/${inputId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should update an input with name and description', () => {
      const inputId = 1;
      const name = 'Updated Name';
      const description = 'Updated Description';
      const mockResponse: Response<any> = { 
        object: { id: inputId, name: name, description: description } 
      };
      
      service.updateInput(inputId, name, description).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/inputs/${inputId}?name=${name}&description=${description}`);
      expect(req.request.method).toEqual('PATCH');
      req.flush(mockResponse);
    });

    it('should update an input with only name', () => {
      const inputId = 1;
      const name = 'Updated Name';
      const mockResponse: Response<any> = { 
        object: { id: inputId, name: name } 
      };
      
      service.updateInput(inputId, name).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/inputs/${inputId}?name=${name}&`);
      expect(req.request.method).toEqual('PATCH');
      req.flush(mockResponse);
    });
  });

  // Run methods tests
  describe('Run methods', () => {
    it('should get all runs', () => {
      const mockResponse: CollectionResponse<any> = { data: [{ id: 1, status: 2 }] };
      
      service.getRuns().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should get runs filtered by workflow ID', () => {
      const workflowId = 'workflow123';
      const mockResponse: CollectionResponse<any> = { data: [{ id: 1, workflow_id: workflowId }] };
      
      service.getRuns(workflowId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs?workflow_id=${workflowId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should create a run with input ID', () => {
      const inputId = 1;
      const mockResponse: Response<any> = { object: { id: 2, input_id: inputId } };
      
      service.createRun(inputId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs?input_id=${inputId}`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(null);
      req.flush(mockResponse);
    });

    it('should create a run with input submission', () => {
      const inputSubmission = { task_type: 'HelloWorld', values: { name: 'Test' } };
      const mockResponse: Response<any> = { object: { id: 2 } };
      
      service.createRun(undefined, inputSubmission).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(inputSubmission);
      req.flush(mockResponse);
    });

    it('should get run events', () => {
      const mockResponse = { events: [{ run_id: 1, status: 'COMPLETED' }] };
      
      service.getRunEvents().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs/events`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should get a run by ID', () => {
      const runId = 1;
      const mockResponse: Response<any> = { object: { id: runId, status: 2 } };
      
      service.getRun(runId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs/${runId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should get run results', () => {
      const runId = 1;
      const mockResponse: Response<any> = { object: { id: 2, run_id: runId } };
      
      service.getRunResults(runId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs/${runId}/results`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should get run inputs', () => {
      const runId = 1;
      const mockResponse: Response<any> = { object: { id: 3, name: 'Input for run 1' } };
      
      service.getRunInputs(runId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/runs/${runId}/inputs`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });
  });

  // Result methods tests
  describe('Result methods', () => {
    it('should get all results', () => {
      const mockResponse: CollectionResponse<any> = { data: [{ id: 1, run_id: 1 }] };
      
      service.getResults().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/results`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should get a result by ID', () => {
      const resultId = 1;
      const mockResponse: Response<any> = { object: { id: resultId, run_id: 2 } };
      
      service.getResult(resultId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/results/${resultId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('should update a result with name and description', () => {
      const resultId = 1;
      const name = 'Updated Result';
      const description = 'Updated Description';
      const mockResponse: Response<any> = { 
        object: { id: resultId, name: name, description: description } 
      };
      
      service.updateResult(resultId, name, description).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/results/${resultId}?name=${name}&description=${description}`);
      expect(req.request.method).toEqual('PATCH');
      req.flush(mockResponse);
    });

    it('should update a result with only description', () => {
      const resultId = 1;
      const description = 'Updated Description';
      const mockResponse: Response<any> = { 
        object: { id: resultId, description: description } 
      };
      
      service.updateResult(resultId, undefined, description).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
      
      const req = httpTestingController.expectOne(`${defaultBaseUrl}/results/${resultId}?description=${description}`);
      expect(req.request.method).toEqual('PATCH');
      req.flush(mockResponse);
    });
  });

  // Health check test
  it('should get health check status', () => {
    const mockResponse = { status: 'ok' };
    
    service.getHealthCheck().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    
    const req = httpTestingController.expectOne(`${defaultBaseUrl}/monitors/servers/health`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });
});
