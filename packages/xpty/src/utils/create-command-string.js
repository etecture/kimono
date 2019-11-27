export function createCommandString(command) {
    const options = command.args.reduce((result, { key, value }) => {
        const kv = `${key} ${value}`;
        return [...result, kv];
    }, []);
    const cmd = `${command.cmd} ${options.join(' ')}`;
    return cmd.replace(/\s\s/g, ' ');
}
//# sourceMappingURL=create-command-string.js.map