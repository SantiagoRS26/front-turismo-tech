export const sendMessage = `
  mutation SendMessage($humanMessage: String!, $sessionId: String!) {
    sendMessage(humanMessage: $humanMessage, sessionId: $sessionId)
  }
`;
