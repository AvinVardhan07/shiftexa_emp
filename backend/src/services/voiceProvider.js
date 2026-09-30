const { v4: uuidv4 } = require('uuid');

class VoiceProvider {
  constructor(name = 'Retell') {
    this.name = name;
  }

  async createCall({ employee, lead, direction = 'TEST' }) {
    const providerCallId = `call_${this.name.toLowerCase()}_${uuidv4().substring(0, 8)}`;
    return {
      providerCallId,
      status: 'RINGING',
      startedAt: new Date(),
      webSocketUrl: `ws://localhost:5000/media-stream/${providerCallId}`
    };
  }

  async endCall(providerCallId) {
    return {
      providerCallId,
      status: 'COMPLETED',
      endedAt: new Date()
    };
  }
}

module.exports = new VoiceProvider();
