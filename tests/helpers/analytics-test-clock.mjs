// Isolated CLI test process only. Production expiry validation is unchanged.
const NativeDate = globalThis.Date;
const fixed = NativeDate.parse('2026-09-02T10:30:00Z');
globalThis.Date = class extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [fixed])); }
  static now() { return fixed; }
};
