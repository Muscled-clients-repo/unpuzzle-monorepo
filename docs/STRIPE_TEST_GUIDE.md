# Stripe Test Checkout Guide

## Quick Test Setup

### Test Card Numbers
Use these test cards for different scenarios:

**✅ Successful Payment**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25` (any future date)
- CVC: `123` (any 3 digits)
- ZIP: `12345` (any 5 digits)

**❌ Declined Payment**
- Card: `4000 0000 0000 0002`

**⚠️ Insufficient Funds**
- Card: `4000 0000 0000 9995`

**🔄 Processing Error**
- Card: `4000 0000 0000 0119`

### Other Test Cards
- **Visa Debit**: `4000 0566 5566 5556`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`

## Test Process

1. **Navigate to checkout page** for any course
2. **Fill out the form**:
   - Email: Any valid email format
   - Card: Use test card number above
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Address: Any valid address
3. **Click "Complete Purchase"**
4. **Success**: Redirects to course learning page
5. **Error**: Shows error message in checkout form

## What Happens in Test Mode

- ✅ No real money charged
- ✅ Webhooks triggered to test endpoints
- ✅ Transactions visible in Stripe Dashboard (Test Data)
- ✅ User enrollment processed
- ✅ Course access granted

## Troubleshooting

**Button appears white?**
- Hard refresh browser (Ctrl+F5)
- Clear browser cache
- Check browser console for errors

**Payment not processing?**
- Verify test card number is correct
- Check all form fields are filled
- Ensure using test environment keys

**Webhook not firing?**
- Check webhook endpoint in Stripe Dashboard
- Verify webhook secret matches environment variable
- Check server logs for webhook signature errors

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Quick Verification Checklist

- [ ] Can access checkout page without 404 error
- [ ] Form displays with purple gradient button
- [ ] Test card `4242 4242 4242 4242` processes successfully
- [ ] Redirects to course after payment
- [ ] User is enrolled in course
- [ ] Webhook received in server logs