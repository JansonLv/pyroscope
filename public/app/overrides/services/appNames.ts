import { App, appsModel } from '@webapp/models/app';
import { Result } from '@webapp/util/fp';
import { z } from 'zod';
import type { ZodError } from 'zod';
import type { RequestError } from '@webapp/services/base';
import { parseResponse, request } from '@webapp/services/base';

export interface FetchAppsError {
  message?: string;
}

const appNamesResponse = z.array(z.string()).transform((names) => {
  return names.map((name) => {
    return {
      name,
      spyName: 'unknown',
      units: 'unknown',
    };
  });
});

export async function fetchApps(): Promise<
  Result<App[], RequestError | ZodError>
> {
  const response = await request('/pyroscope/label-values?label=__name__');

  if (response.isOk) {
    return parseResponse(response, appNamesResponse);
  }

  return Result.err<App[], RequestError>(response.error);
}
