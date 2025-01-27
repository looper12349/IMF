const codenamePrefixes = ['The', 'Operation'];
const codenameNouns = ['Nightingale', 'Kraken', 'Phoenix', 'Shadow', 'Phantom', 'Raven'];

exports.generateCodename = () => {
  const prefix = codenamePrefixes[Math.floor(Math.random() * codenamePrefixes.length)];
  const noun = codenameNouns[Math.floor(Math.random() * codenameNouns.length)];
  return `${prefix} ${noun}`;
};