window.addEventListener('load', async function () {
    await Clerk.load()

    if (Clerk.user) {
      document.getElementById('app').innerHTML = `
        <div id="user-button"></div>
      `

      const userButtonDiv = document.getElementById('user-button')

      Clerk.mountUserButton(userButtonDiv)
    } else {
      document.getElementById('app').innerHTML = `
        <div id="sign-in"></div>
      `

      Clerk.mountSignIn(document.getElementById('sign-in'), {
        afterSignInUrl: `https://${this.window.location.host}/api/user-auth/refresh`,
        signUpUrl: `https://${this.window.location.host}/sign-up`
      });
   
    }
})