const stripe = Stripe('pk_test_51RebMZ2fB4WJ1ELeiZQXVTkzG3TZFKJpzmvD2QHc5rAwM16TSUcBMe1NDoENz1d1aeKmthsIWfGOKLUsAd8wvW4R00JRu8RYP4'); 
const elements = stripe.elements();

// Define custom styling for each field
const style = {
  base: {
    color: "#32325d",  // Text color
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',  // Font family
    fontSize: "16px",  // Font size
    fontSmoothing: "antialiased",  // Font smoothing
    "::placeholder": {
      color: "#aab7c4"  // Placeholder color
    },
  },
  invalid: {
    color: "#fa755a",  // Invalid input text color
    iconColor: "#fa755a"  // Invalid input icon color
  }
};

// Create the elements
const cardNumber = elements.create('cardNumber', { style: style });
const expiry = elements.create('cardExpiry', { style: style });
const cvc = elements.create('cardCvc', { style: style });
const postalCode = elements.create('postalCode', { style: style });

// Mount the elements to the DOM
cardNumber.mount('#card-element');
expiry.mount('#expiry-element');
cvc.mount('#cvc-element');
postalCode.mount('#postal-code-element');


const paymentForm = document.getElementById('payment-form');
const setLoading = (isLoading) =>{
  if(isLoading){  
      paymentForm.classList.add('loading');
  }else{
      paymentForm.classList.remove('loading');
  }
}
paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const paymentMessage = document.getElementById('payment-message');

    try{
      setLoading(true)
      // Get payment intent client secret from your backend
      const paymentCreate = await fetch('/api/orders', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "payment_method":"credit_card",
          "payment_currency":"USD",
          "items":[
              {
                  "product_id":"f218539e-cddb-4cda-9062-0e420d2cf3b0",
                  "quantity":1
              }
          ]
        }),
      })
  
      const {data} = await paymentCreate.json()
  
      console.log(data)
  
      // Confirm the payment with the client secret
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: {
              card: cardNumber,
              billing_details: {
                  name: 'Test User',
              },
          },
      });
  
      if (error) {
          console.log(error.message);
      } else if (paymentIntent.status === 'succeeded') {
          paymentMessage.innerHTML = `Payment successful and payment id is: ${paymentIntent.id}`
          setTimeout(()=>{
            window.location.href="/"
          }, 2000)
      }
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false)
    }

});