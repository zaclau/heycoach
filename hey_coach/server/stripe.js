import { concatAST } from 'graphql';
import { graphQLFetch } from '../src/graphQL/graphQLFetch';
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: process.env.REACT_APP_STRIPE_API_VERSION
});

// Helper function that get the currency symbol for the given country ISO code
const getCurrencySymbol = currency => {
  const currencySymbol = new Intl.NumberFormat('en', {
    currency,
    style: 'currency'
  }).formatToParts(0).find(part => part.type === 'currency');

  return currencySymbol && currencySymbol.value;
}

// Function that returns a test card token for Stripe
function getTestSource(behavior) {
  // Important: We're using static tokens based on specific test card numbers
  // to trigger a special behavior. This is NOT how you would create real payments!
  // You should use Stripe Elements or Stripe iOS/Android SDKs to tokenize card numbers.
  // Use a static token based on a test card: https://stripe.com/docs/testing#cards
  var source = 'tok_visa';
  // We can use a different test token if a specific behavior is requested
  if (behavior === 'immediate_balance') {
    source = 'tok_bypassPending';
  } else if (behavior === 'payout_limit') {
    source = 'tok_visa_triggerTransferBlock';
  }

  return source;
}

// Function that retrieves the balance from Stripe
async function getStripeBalance(user) {
  try {
    // Retrieve the balance from Stripe
    const balance = await stripe.balance.retrieve({
      stripe_account: user.stripeAccountId,
    });

    return balance;
  } catch (error) {
    // Handle errors here if needed
    console.error('Error retrieving Stripe balance:', error.message);

    throw error;
  }
}


async function createStripePayout(balance, user) {
  // This app only uses SGD so we'll just use the first available balance
  // (Note: there is one balance for each currency used)
  const { amount, currency } = balance.available[0];

  // Create a payout
  try {
    const payout = await stripe.payouts.create({
      amount: amount,
      currency: currency,
      statement_descriptor: process.env.REACT_APP_APP_NAME,
    }, { stripe_account: user.stripeAccountId });

    return payout;
  } catch (error) {
    // Handle errors here if needed
    console.error('Error creating Stripe payout:', error.message);

    throw error;
  }
}

// Function that creates a charge and transfer on Stripe
async function createStripeChargeAndTransfer(source_acc, booking, user) {
  // Get a test source, using the given testing behavior
  let source;
  if (source_acc === 'immediate_balance') {
    source = getTestSource('immediate_balance');
  } else if (rsource_acc === 'payout_limit') {
    source = getTestSource('payout_limit');
  }

  try {
    // Create a charge
    const charge = await stripe.charges.create({
      source: source,
      amount: booking.amount,
      currency: booking.currency,
      description: process.env.REACT_APP_APP_NAME,
      statement_descriptor: process.env.REACT_APP_APP_NAME,
      // The `transfer_group` parameter must be a unique id for the booking;
      // it must also match between the charge and transfer
      transfer_group: booking.id
    });

    // Create a transfer
    const transfer = await stripe.transfers.create({
      amount: booking.amountForPilot(),
      currency: booking.currency,
      destination: user.stripeAccountId,
      transfer_group: booking.id
    });
  } catch (error) {
    // Handle errors here if needed
    console.error('Error creating Stripe charge/transfer:', error.message);

    throw error;
  }

  return { charge };
}
// Add the Stripe charge reference to the booking and save it in db

// Function to create a new Stripe account for the user
async function createStripeAccount(user, refresh_url, return_url) {
  try {
    console.log('hello from stripe.js');
    console.log('ENV: ', process.env.REACT_APP_APP_NAME);
    // Define the parameters to create a new Stripe account with
    let accountParams = {
      type: 'express',
      country: user.country || undefined,
      email: user.email || undefined,
      business_type: 'individual',
    };

    accountParams = Object.assign(accountParams, {
      individual: {
        first_name: user.firstName || undefined,
        last_name: user.lastName || undefined,
        email: user.email || undefined,
      },
    });

    // Create a new Stripe account
    const account = await stripe.accounts.create(accountParams);
    user.stripeCustomerId = account.id;
    console.log('account: ', account.id);
    console.log('user: ', user);
    const updatedUser = await updateStripeID(user);
    console.log('updatedUser: ', updatedUser);
    // Update and store the Stripe account ID in the datastore:
    // this Stripe account ID will be used to issue payouts to the user

    // Create an account link for the user's Stripe account
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.REACT_APP_DOMAIN + refresh_url, //current endpt
      return_url: process.env.REACT_APP_DOMAIN + return_url, //redirect to this endpt
      type: 'account_onboarding'
    });

    // Redirect to Stripe to start the Express onboarding flow
    window.location.href = accountLink.url;
    //<Redirect to={accountLink.url} />;

  } catch (error) {
    // Handle errors here if needed
    console.error('Error creating Stripe account:', error.message);

    throw error;
  }
}

// Function to create a checkout payment flow
async function createCheckoutSession(items, connectedAccountId, successUrl, cancelUrl) {
  console.log('hello from createCheckoutSession');
  console.log('items: ', items);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items,
    success_url: process.env.REACT_APP_DOMAIN + successUrl,
    cancel_url: process.env.REACT_APP_DOMAIN + cancelUrl,
  },
  {
    stripeAccount: connectedAccountId,
  });

  window.location.href = session.url;
};


// Function to retrieve the user's Stripe account and check if they have finished onboarding
async function checkStripeAccountOnboarding(user, res) {
  try {
    const account = await stripe.account.retrieve(user.stripeAccountId);

    if (account.details_submitted) {
      // Redirect to the listings page
      res.redirect('/listings');
    } else {
      console.log('The onboarding process was not completed.');
      res.redirect('/signup');
    }
  } catch (error) {
    console.error('Error retrieving Stripe account:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

// Function to generate a unique login link for the associated Stripe account to access their Express dashboard
async function generateAndRedirectToStripeDashboard(req, res, user) {
  try {
    // Generate a unique login link for the associated Stripe account to access their Express dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripeAccountId, {
        redirect_url: process.env.REACT_APP_DOMAIN + '/profile'
      }
    );

    // Directly link to the account tab if specified in the query parameters
    if (req.query.account) {
      loginLink.url += '#/account';
    }

    // Redirect the user to Stripe using the generated login link
    return res.redirect(loginLink.url);
  } catch (error) {
    console.error('Error generating or redirecting to Stripe login link:', error.message);
    // Handle the error or send an appropriate response
    res.status(500).send('Internal Server Error');
  }
}

// Create new User with Coach Profile
async function updateStripeID(data) {
  const updateUserProfileMutation = `
      mutation updateUserProfile($userId: ID!, $updatedProfile: InputsForUserProfile!) {
          updateUserProfile(userId: $userId, updatedProfile: $updatedProfile) {
              _id
              email
              firstName
              lastName
              stripeCustomerId
          }
      }
  `;

  const email = data.email;
  const firstName = data.firstName;
  const stripeCustomerId = data.stripeCustomerId
  const userProfileInput = {
      userId: data._id,
      updatedProfile: {
        email,
        firstName,
        stripeCustomerId
      }
  };

  try {
    const updatedUser = await graphQLFetch(updateUserProfileMutation, userProfileInput);
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export { getCurrencySymbol, getStripeBalance, createStripePayout, createStripeChargeAndTransfer, createStripeAccount, createCheckoutSession, checkStripeAccountOnboarding, generateAndRedirectToStripeDashboard };