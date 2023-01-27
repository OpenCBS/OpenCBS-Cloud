import { ValidateDatePipe } from './validate-date.pipe';

describe('ValidateDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ValidateDatePipe();
    expect(pipe).toBeTruthy();
  });
});
