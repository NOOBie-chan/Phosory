import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

emailjs.init("hzYpGwbtgq7-kUZMg");

function showToast(message) {

  let toast =
    document.createElement("div");

  toast.innerText =
    message;

  Object.assign(
    toast.style,
    {
      position: "fixed",
      top: "30px",
      right: "30px",
      background: "#111827",
      color: "#fff",
      padding: "18px 22px",
      borderRadius: "16px",
      zIndex: "999999",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow:
        "0 10px 40px rgba(0,0,0,0.4)"
    }
  );

  document.body.appendChild(
    toast
  );

  setTimeout(() => {

    toast.remove();

  }, 3000);

}



function showSuccessAnimation() {

  const overlay =
    document.createElement(
      "div"
    );

  Object.assign(
    overlay.style,
    {
      position: "fixed",
      inset: "0",
      background:
        "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "999999"
    }
  );

  overlay.innerHTML = `

<div style="
width:130px;
height:130px;
border-radius:50%;
background:
linear-gradient(
135deg,
#00ffff,
#6c63ff
);
display:flex;
justify-content:center;
align-items:center;
">

<i class="fas fa-check"
style="
font-size:3rem;
color:white;
"></i>

</div>

`;

  document.body.appendChild(
    overlay
  );

  setTimeout(() => {

    overlay.remove();

  }, 1600);

}



async function verifyTurnstile(
  token
) {

  const response =
    await fetch(
      "/.netlify/functions/verify-turnstile",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          token,
          formType: "client"
        })

      }
    );

  const data =
    await response.json();

  return data;

}



document.addEventListener(
  "DOMContentLoaded",
  () => {

    const clientForm =
      document.getElementById(
        "clientForm"
      );



    if (clientForm) {

      let submitting =
        false;

      const button =
        clientForm.querySelector(
          ".submit-btn"
        );



      clientForm.addEventListener(
        "submit",
        async (e) => {

          e.preventDefault();

          if (submitting)
            return;

          submitting =
            true;

          const original =
            button.innerHTML;

          button.disabled =
            true;

          button.innerHTML =
            "Sending...";



          try {

            const widget =
              document.querySelector(
                '#clientForm [name="cf-turnstile-response"]'
              );

            const token =
              widget?.value;



            if (!token) {

              throw new Error(
                "Complete security verification"
              );

            }



            const verify =
              await verifyTurnstile(
                token
              );



            if (
              !verify ||
              verify.success !== true
            ) {

              throw new Error(
                "Captcha failed"
              );

            }



            const data =
              Object.fromEntries(
                new FormData(
                  clientForm
                )
              );



            await emailjs.send(
              "service_8sgugr4",
              "template_3g1hxrs",
              data
            );



            showSuccessAnimation();

            showToast(
              "Message sent successfully"
            );



            clientForm.reset();



            if (
              window.turnstile
            ) {

              turnstile.reset();

            }



            button.innerHTML =
              "Sent ✓";

          }

          catch (err) {

            console.error(
              err
            );

            button.innerHTML =
              "Failed ✕";

            showToast(
              err.message ||
              "Failed to send"
            );

          }



          setTimeout(() => {

            button.innerHTML =
              original;

            button.disabled =
              false;

            submitting =
              false;

          }, 2000);

        }

      );

    }

  }

);