const codenamePrefixes = ["The", "Operation", "Project", "Mission", "Codename", "Protocol"];
const codenameNouns = [
  "Nightingale", "Kraken", "Phoenix", "Shadow", "Phantom", "Raven", "Eagle", "Storm",
  "Wolf", "Tiger", "Dragon", "Falcon", "Viper", "Hawk", "Scorpion", "Spectre", "Griffin"
];

exports.generateCodename = () => {
  const prefix = codenamePrefixes[Math.floor(Math.random() * codenamePrefixes.length)];
  const noun = codenameNouns[Math.floor(Math.random() * codenameNouns.length)];
  return `${prefix} ${noun}`;
};