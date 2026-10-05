function mapFilenames(filenames) {
  return filenames.map((filename) => `"${filename}"`).join(' ');
}

export default {
  'src/**/*.(js|jsx|ts|tsx)': (filenames) => [
    `prettier --no-error-on-unmatched-pattern --write ${mapFilenames(
      filenames
    )}`,
    `eslint --cache --color --fix ${mapFilenames(filenames)}`,
  ],
};
