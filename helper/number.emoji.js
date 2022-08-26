function numberToEmoji(number) {
  const input = parseInt(number);
  switch (input) {
    case 0: {
      return `:zero:`;
    }
    case 1: {
      return `:one:`;
    }
    case 2: {
      return `:two:`;
    }
    case 3: {
      return `:three:`;
    }
    case 4: {
      return `:four:`;
    }
    case 5: {
      return `:five:`;
    }
    case 6: {
      return `:six:`;
    }
    case 7: {
      return `:seven:`;
      break;
    }
    case 8: {
      return `:eight:`;
      break;
    }
    case 9: {
      return `:nine:`;
      break;
    }
    default:
      break;
  }
}

module.exports = {
  numberToEmoji,
};
