import { getCoordinates } from '../src/client/js/application.js'

test('test coordinates', () => {
    expect(getCoordinates('paris')).rejects;
  });

