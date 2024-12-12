const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const accountId = process.env.ACCOUNT_ID;
const zoomApiUrl = "https://api.zoom.us/v2";
const crypto = require("crypto");
const axios = require("axios");

class OnlineClass {
  static getOAuthToken = async () => {
    const token = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "account_credentials",
        account_id: accountId,
      },
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return response.data.access_token;
  };

  static generateSignature = async (meetingNumber, role) => {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(
      `${clientId}${meetingNumber}${timestamp}${role}`
    ).toString("base64");
    const hash = crypto
      .createHmac("sha256", clientSecret)
      .update(msg)
      .digest("base64");
    const signature = Buffer.from(
      `${clientId}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString("base64");

    return signature;
  };
  static async generateAccessToken(meetiingNumber, role) {
    try {
      return this.generateSignature(meetiingNumber, role);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = OnlineClass;
