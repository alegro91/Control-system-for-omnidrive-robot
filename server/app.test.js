const { getClientIp } = require("./app");

test('should return the client IP address without the "::ffff:" prefix', () => {
  const socket = {
    handshake: {
      address: "::ffff:192.0.2.1",
    },
  };

  const result = getClientIp(socket);

  expect(result).toBe("192.0.2.1");
});
