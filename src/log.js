export function log(...args) {
  process.stdout.write(args.join(' ') + '\n');
}
