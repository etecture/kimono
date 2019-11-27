import shortid from 'shortid';
export function createCommand(values) {
    return Object.assign(Object.assign({}, values), { id: values.id || shortid.generate(), args: values.args || [], env: values.env || [] });
}
//# sourceMappingURL=command.js.map