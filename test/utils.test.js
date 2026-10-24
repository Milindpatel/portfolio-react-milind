import { describe, expect, it } from 'vitest';
import { formatLongDate, formatMonthYear, getCookieFromHeader, shortenText } from '../lib/utils';
import { validatePortfolio } from '../lib/validation';

describe('utils', () => {
  it('reads cookies and handles a missing header', () => {
    expect(getCookieFromHeader('a=1; jwt=abc.def; b=2', 'jwt')).toBe('abc.def');
    expect(getCookieFromHeader('a=1', 'jwt')).toBeUndefined();
    expect(getCookieFromHeader(undefined, 'jwt')).toBeUndefined();
  });

  it('shortens long text only', () => {
    expect(shortenText('short', 10)).toBe('short');
    expect(shortenText('a'.repeat(20), 10)).toBe(`${'a'.repeat(10)} ...`);
  });

  it('formats ISO and millisecond-string dates', () => {
    expect(formatMonthYear('2021-03-15T00:00:00Z')).toMatch(/March 2021/);
    expect(formatLongDate(String(Date.UTC(2020, 0, 2, 12)))).toMatch(/January 2, 2020/);
    expect(formatMonthYear('not a date')).toBe('');
  });
});

describe('validatePortfolio', () => {
  const valid = { title: 'T', company: 'C', location: 'L', position: 'P', description: 'D', startDate: new Date('2020-01-01'), endDate: null };

  it('accepts a complete entry with no end date', () => {
    expect(validatePortfolio(valid)).toEqual({});
  });

  it('requires fields', () => {
    expect(validatePortfolio({ ...valid, title: '  ', company: '' })).toEqual({
      title: 'Title is required',
      company: 'Company is required',
    });
  });

  it('rejects an end date before the start date', () => {
    expect(validatePortfolio({ ...valid, endDate: new Date('2019-01-01') }).endDate).toMatch(/before start/);
  });
});
