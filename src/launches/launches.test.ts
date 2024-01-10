import { agent as request } from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LaunchesModule } from './launches.module';
import { ZodExceptionFilter } from '@src/utils/zod/zod-exception.filter';

let app: INestApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [LaunchesModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.useGlobalFilters(new ZodExceptionFilter()).init();
});

describe('Test GET /Launches', () => {
  test('It should respond with 200 success', async () => {
    await request(app.getHttpServer())
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /Launch', () => {
  const completeLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    destination: 'Kepler-186 f',
    launchDate: 'January 4, 2028',
  };

  const launchDataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    destination: 'Kepler-186 f',
  };

  const launchDataWithoutMission = {
    rocket: 'NCC 1701-D',
    destination: 'Kepler-186 f',
    launchDate: 'January 4, 2028',
  };

  const launchDataWithInvalidDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    destination: 'Kepler-186 f',
    launchDate: 'zoot',
  };

  test('It should respond with 201 created', async () => {
    const response = await request(app.getHttpServer())
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test('It should catch missing required properties', async () => {
    const response = await request(app.getHttpServer())
      .post('/launches')
      .send(launchDataWithoutMission)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      errors: ['Field: mission - Message: Required'],
      message: 'Validation Failed',
      statusCode: 400,
    });
  });

  test('It should catch invalid dates', async () => {
    const response = await request(app.getHttpServer())
      .post('/launches')
      .send(launchDataWithInvalidDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      errors: ['Field: launchDate - Message: Invalid date'],
      message: 'Validation Failed',
      statusCode: 400,
    });
  });
});
