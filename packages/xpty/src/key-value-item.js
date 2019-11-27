import shortid from 'shortid';
export function createKeyValueItem({ type = 'string', id = shortid.generate(), key, value } = {}) {
    return {
        id,
        key,
        value,
        type
    };
}
//# sourceMappingURL=key-value-item.js.map