export const shortenMessage = (message: any) => {
  if (typeof message === 'string' && message.length > 23) {
    return `${message.slice(0, 24)}...+${message.length - 24}`;
  }

  if (typeof message === 'object' && message !== null) {
    const copy = { ...message };

    for (const key of Object.keys(message)) {
      copy[key] = shortenMessage(message[key]);
    }
    return copy;
  }

  return message;
};
