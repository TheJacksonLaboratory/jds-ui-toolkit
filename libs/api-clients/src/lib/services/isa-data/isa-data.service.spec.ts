import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

// services
import { ISADataService } from './isa-data.service';
// tokens
import { ISA_DATA_SERVICE_CONFIG } from '../../tokens/isa-data-config.token';
// models
import { Response } from '../../models/response';
import { ErrorResponse } from '../../models/error';
import {
  IsaCharacteristic,
  MeasureSeriesMetadata,
} from '../../models/isa-data/isa-data.model';

describe('ISADataService', () => {
  let service: ISADataService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'https://isa.test/api';

  const emptyInputError: ErrorResponse = {
    code: 'BAD_REQUEST',
    num_code: 400,
    message: 'missing required parameter: measureSeriesIds',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ISA_DATA_SERVICE_CONFIG, useValue: { baseUrl } },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ISADataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMeasureSeriesMetadata', () => {
    it('requests metadata for the given measure series IDs', () => {
      const mockResponse: Response<MeasureSeriesMetadata> = {
        object: {
          assay_id: 1,
          description: 'body weight',
          measure_ids: ['1'],
          measure_series_id: '130499',
          measurement_units: 'g',
          method: 'scale',
          treatment: 'none',
          treatment_units: 'none',
          variable_name: 'bw',
        },
      };

      service.getMeasureSeriesMetadata(['130499']).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${baseUrl}/visualization/measures/metadata?measureSeriesIds=130499`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('throws a 400 ErrorResponse when measureSeriesIds is empty', () => {
      let thrown: unknown;

      try {
        service.getMeasureSeriesMetadata([]);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toEqual(emptyInputError);
    });
  });

  describe('getMeasureSeriesCharacteristics', () => {
    it('requests characteristics for the given measure series IDs', () => {
      const mockResponse: Response<IsaCharacteristic> = {
        object: {
          name: 'sex',
          value: { value: 'female', label: 'Female', metadata: {} },
        },
      };

      service
        .getMeasureSeriesCharacteristics(['130499'])
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpTestingController.expectOne(
        `${baseUrl}/visualization/measures/characteristics?measureSeriesIds=130499`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    });

    it('throws a 400 ErrorResponse when measureSeriesIds is empty', () => {
      let thrown: unknown;

      try {
        service.getMeasureSeriesCharacteristics([]);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toEqual(emptyInputError);
    });
  });
});
