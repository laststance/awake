/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/set.d.ts" />

const set = new Set<'read' | 'write'>(['read', 'write'])
// has() accepts any string, not just 'read' | 'write'
const result: boolean = set.has('delete' as string)
