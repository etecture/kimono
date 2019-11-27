import { ParsedPath } from 'gulp-rename';
import { renderPath } from '../src/renderPath';
import { parsePath } from '../src/utils';

describe('renderPath', function() {
  it('noop for regular paths', function() {
    const given: ParsedPath = parsePath('my/dir/file.txt');
    const result = renderPath(given, {});
    expect(result).toEqual(given);
  });

  ['dirname', 'basename', 'extname'].forEach(fieldName => {
    testSimpleBinary(fieldName);
    testSimpleBinaryInverted(fieldName);

    testComplexBinary(fieldName);
    testComplexBinaryInverted(fieldName);

    testSimpleTernary(fieldName);
    testSimpleTernaryInverted(fieldName);

    testComplexTernary(fieldName);
  });
});

function testSimpleBinary(fieldName: string): void {
  const givenValue = '{%= foo && "fileName" %}';
  it(`${fieldName}: simple binary - truthy`, function() {
    const context = { foo: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'fileName'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`${fieldName}: simple binary - falsy`, function() {
    const context = { foo: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: ''
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}
function testSimpleBinaryInverted(fieldName: string): void {
  const givenValue = '{%= (!foo #++ "usedValue") %}';
  it(`binary condition in ${fieldName} - truthy value`, function() {
    const context = { foo: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: ''
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`binary condition in ${fieldName} - falsy value`, function() {
    const context = { foo: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'usedValue'
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}

function testComplexBinary(fieldName: string): void {
  const givenValue = '{%= (foo #++ "a" #-- bar #++ "b" #-- "c") %}';

  it(`binary condition in ${fieldName} - first truthy`, function() {
    const context = { foo: true, bar: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'a'
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`binary condition in ${fieldName} - second truthy`, function() {
    const context = { foo: false, bar: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'b'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`binary condition in ${fieldName} - falsy`, function() {
    const context = { foo: false, bar: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'c'
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}
function testComplexBinaryInverted(fieldName: string): void {
  const givenValue = '{%= (!foo #++ "a" #-- (!bar #++ "b") #-- "c") %}';

  it(`binary condition in ${fieldName} - both truthy`, function() {
    const context = { foo: true, bar: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'c'
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`binary condition in ${fieldName} - foo truthy`, function() {
    const context = { foo: true, bar: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'b'
    });

    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`binary condition in ${fieldName} - foo falsy`, function() {
    const context = { foo: false, bar: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'a'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}

function testSimpleTernary(fieldName: string): void {
  const givenValue = '{%= (foo ? "leftHandValue" : "rightHandValue") %}';

  it(`ternary condition in ${fieldName} - truthy`, function() {
    const context = { foo: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'leftHandValue'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`ternary condition in ${fieldName} - falsy`, function() {
    const context = { foo: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'rightHandValue'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}
function testSimpleTernaryInverted(fieldName: string): void {
  const givenValue = '{%= (!foo ? "leftHandValue" : "rightHandValue") %}';

  it(`ternary condition in ${fieldName} - truthy`, function() {
    const context = { foo: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'rightHandValue'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`ternary condition in ${fieldName} - falsy`, function() {
    const context = { foo: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'leftHandValue'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}

function testComplexTernary(fieldName: string): void {
  const givenValue =
    '{%= (foo ? (bar ? "leftHandFooBar" : "leftHandFoo") : bar ? "rightHandFooBar" : "rightHandFoo") %}';

  it(`ternary condition in ${fieldName} - both truthy`, function() {
    const context = { foo: true, bar: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'leftHandFooBar'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });

  it(`ternary condition in ${fieldName} - first truthy`, function() {
    const context = { foo: true, bar: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'leftHandFoo'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`ternary condition in ${fieldName} - second truthy`, function() {
    const context = { foo: false, bar: true };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'rightHandFooBar'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
  it(`ternary condition in ${fieldName} - none truthy`, function() {
    const context = { foo: false, bar: false };
    const { given, expected } = getStubs({
      fieldName,
      givenValue,
      expectedValue: 'rightHandFoo'
    });
    const result = renderPath(given, context);
    expect(result).toEqual(expected);
  });
}

interface StubArgs {
  fieldName: string;
  givenValue: string;
  expectedValue: string;
}
interface Stub {
  given: ParsedPath;
  expected: ParsedPath;
}
function getStubs({ fieldName, givenValue, expectedValue }: StubArgs): Stub {
  const base: ParsedPath = {
    basename: 'basename',
    extname: 'extname',
    dirname: 'dirname'
  };

  return {
    given: {
      ...base,
      [fieldName]: givenValue
    },
    expected: {
      ...base,
      [fieldName]: expectedValue
    }
  };
}
