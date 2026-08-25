import { describe, expect, it } from 'vitest';

import { Entity } from './Entity';

class CustomEntity extends Entity<{ marker: string }> { }

describe('Core Entity', () => {
  it('should generate an ID if not provided', () => {
    const entity = new CustomEntity({ marker: "a" })

    expect(entity.id).toBeTruthy()
  })

  it('should use the provided ID if provided', () => {
    const entity = new CustomEntity({ marker: "a" }, "custom-id")

    expect(entity.id).toEqual('custom-id')
  })
});