import { shortId, shortNumberId } from '@app/common';

describe('shortId', function () {
  it('shortId', async () => {
    const result = shortId();
    // console.log(result);
    expect(result.length).toBe(10);
  });

  it('shortNumberId', async () => {
    const result = shortNumberId();
    // console.log(result);
    expect(result.length).toEqual(6);
  });
});
