const requestStore = new Map();

export async function handler(event) {
  try {

    const ip = (
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["x-forwarded-for"] ||
      "unknown"
    ).split(",")[0];

    const now = Date.now();

    const limit = 5;
    const windowTime = 10 * 60 * 1000;

    if (!requestStore.has(ip)) {
      requestStore.set(ip, []);
    }

    let requests = requestStore.get(ip);

    requests = requests.filter(
      time => now - time < windowTime
    );

    if (requests.length >= limit) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          success: false,
          message: "Too many requests. Try again later."
        })
      };
    }

    requests.push(now);

    requestStore.set(ip, requests);

    const { token, formType } = JSON.parse(event.body);

    let secret;

    if (formType === "client") {
      secret = process.env.CLIENT_TURNSTILE_KEY;
    }
    else if (formType === "dev") {
      secret = process.env.DEV_TURNSTILE_KEY;
    }
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Invalid form"
        })
      };
    }

    const params = new URLSearchParams();

    params.append("secret", secret);
    params.append("response", token);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: params
      }
    );

    const data = await response.json();

    if (!data.success) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          success: false,
          message: "Captcha failed"
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };

  } catch (err) {

    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false
      })
    };
  }
}