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
        <div id="sign-up"></div>
      `

      Clerk.mountSignUp(document.getElementById('sign-up'), {
        afterSignUpUrl: `https://${this.window.location.host}/api/user-auth/refresh`,
        signInUrl: `https://${this.window.location.host}/sign-in`
      });
   
    }
})