import test from 'node:test';
import assert from 'node:assert/strict';
import { databasePoolSize } from '../src/lib/db-pool.ts';

test('pool limitado por instancia en Vercel', () => {
  assert.equal(databasePoolSize(undefined, true), 2);
  assert.equal(databasePoolSize(undefined, false), 5);
});

test('solo acepta enteros seguros 1..20', () => {
  for (const value of ['0','-1','21','nope','2.5', 'Infinity']) {
    assert.equal(databasePoolSize(value, true), 2);
  }
  assert.equal(databasePoolSize('3',true), 3);
  assert.equal(databasePoolSize('1',true), 1);
});
