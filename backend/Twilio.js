const twilio = require('twilio');
const VoiceResponse = require('twilio/lib/twiML/VoiceResponse');
const twiML = new VoiceResponse();

class Twilio {
  phoneNumber = '+17873302150';
  phoneNumberSid = 'PN649df5fa889324a65fa15acc94e9f621';
  tokenSid = 'SK4c48981e641f38225c14ad92dcb06094';
  tokenSecret = 'TKLV27pg7nrb66Se6CNSWGcB7dURxElL';
  accountSid = 'AC911afe8d61ae49f400a1384c1dbfc1d5';
  verify = 'VA1f4b01d7c66e32c14b51207d345855c6';
  outgoingAppSid = 'AP2f5c6a05b4bdd39c36007f61f74c59c4';
  client;
  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }
  getTwilio() {
    this.client;
  }

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    console.log('sendVerify');
    return data;
  }

  async verifyCodeAsync(to, code) {
    const data = await this.client.verify
      .services(this.verify)
      .verificationChecks.create({
        to,
        code,
      });
    console.log('verifyCode');
    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: 'female',
      },
      message
    );
    twiml.redirect('https://resiliencyconnection.loca.lt');
    return twiml;
  }

  enqueueCall(queueName) {
    const twiML = new VoiceResponse();
    twiML.enqueue(queueName);
    return twiML;
  }

  redirectCall(client) {
    const twiML = new VoiceResponse();
    twiml.dial().client(client);
    return twiML;
  }

  answerCall(sid) {
    console.log('answerCall with sid', sid);
    this.client.calls(sid).update({
      url: 'https://resiliencyconnection.loca.lt',
      method: 'POST',
      function(err, call) {
        console.log('answerCall', call);
        if (err) {
          console.error('answerCall', err);
        }
      },
    });
  }
  getAccessTokenForVoice = (identity) => {
    console.log(`Access token for ${identity}`);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const outgoingAppSid = this.outgoingApplicationSid;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingAppSid,
      incomingAllow: true,
    });
    const token = new AccessToken(
      this.accountSid,
      this.tokenSid,
      this.tokenSecret,
      { identity }
    );
    token.addGrant(voiceGrant);
    console.log('Access granted with JWT', token.toJwt());
    return token.toJwt();
  };
}
const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;
