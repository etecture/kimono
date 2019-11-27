import { normalizeSyntax, normalizePath } from '../src/normalize';
import { ParsedPath } from 'gulp-rename';

describe('normalizeSyntax', function() {
  it('noop for regular string', function() {
    const value: string = 'this is my foo';
    const result = normalizeSyntax(value);
    expect(result).toEqual(value);
  });
  it('converts custom fs syntax', function() {
    const given: string = 'styles{%= sass #+ (foo #++ ".scss") #- ".css" %}';
    const expected: string = 'styles<%= sass ? (foo && ".scss") : ".css" %>';
    const result = normalizeSyntax(given);
    expect(result).toEqual(expected);
  });
});

describe('normalizePath', function() {
  it('noop for regular paths', function() {
    const given: ParsedPath = {
      dirname: 'foo',
      basename: 'foo',
      extname: 'foo'
    };
    const result = normalizePath(given);
    expect(result).toEqual(given);
  });
  it('replaces brackets', function() {
    const given: ParsedPath = {
      dirname: '{% foo %}',
      basename: '{% foo %}',
      extname: '{% foo %}'
    };
    const expected: ParsedPath = {
      dirname: '<% foo %>',
      basename: '<% foo %>',
      extname: '<% foo %>'
    };
    const result = normalizePath(given);
    expect(result).toEqual(expected);
  });
});
