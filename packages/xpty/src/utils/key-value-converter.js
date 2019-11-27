export function toObject(items) {
    return items.reduce((result, kv) => Object.assign(result, { [kv.key]: kv.value }), {});
}
//# sourceMappingURL=key-value-converter.js.map