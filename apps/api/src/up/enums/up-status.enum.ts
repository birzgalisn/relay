import { registerEnumType } from '@nestjs/graphql';

export enum UpStatus {
  OK = 'OK',
}

registerEnumType(UpStatus, {
  name: 'UpStatus',
  description: 'Health status from the `up` GraphQL query and `GET /up`.',
  valuesMap: {
    [UpStatus.OK]: {
      description:
        'The process is running and the database accepted a connectivity check (`SELECT 1`).',
    },
  },
});
