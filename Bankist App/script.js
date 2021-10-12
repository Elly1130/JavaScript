'use strict';

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-10-05T23:36:17.929Z',
    '2021-10-10T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-10-05T23:36:17.929Z',
    '2021-10-10T10:51:36.790Z',
  ],
  currency: 'MYR',
  locale: 'ms-MY',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'KRW',
  locale: 'ko-KR',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const optionsTime = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

let loginAcc, timer;

/////////////////////////////////////////////////////////////////////////////

// COMPUTE USERNAMES
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase(acc.owner)
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsernames(accounts);

/////////////////////////////////////////////////////////////////////////////

// FORMAT CURRENCY
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(2));
};

/////////////////////////////////////////////////////////////////////////////

// LOGOUT TIMER
const startLogoutTimer = function () {
  const tick = function () {
    const min = `${Math.floor(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timeOut);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    // Decrease 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 300;
  // Call the timer every second
  tick();
  const timeOut = setInterval(tick, 1000);
  return timeOut;
};

/////////////////////////////////////////////////////////////////////////////

// IMPLEMENT LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // Find the account that wish to login
  loginAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  // If the input pin is same as account that wish to login's pin
  if (loginAcc?.pin === +inputLoginPin.value) {
    // Display the UI and welcome message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Good Night, ${loginAcc.owner.split(' ')[0]}`;

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    displayMovements(loginAcc);
    const tick = function () {
      labelDate.textContent = new Intl.DateTimeFormat(
        loginAcc.locale,
        optionsTime
      ).format(new Date());
    };
    tick();
    setInterval(tick, 1000);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }

  // Clear inpur field
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
});

/////////////////////////////////////////////////////////////////////////////

// IMPLEMENT TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // Find the account that wish to transfer to using find method
  const transAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  const transAmount = +inputTransferAmount.value;

  // Clear input field
  inputTransferAmount.value = inputTransferTo.value = '';

  // If transfer amount is greater than 0, current account enough balance for transfer, and not transferring to own account
  if (
    transAmount > 0 &&
    loginAcc.balance >= transAmount &&
    transAcc?.username !== loginAcc.username
  ) {
    // Deduct transfer amount from current account and add transfer amount into account that wish to transfer
    // Add current date and time to current account and transfer account
    transAcc.movements.push(transAmount);
    transAcc.movementsDates.push(new Date().toISOString());
    loginAcc.movements.push(-transAmount);
    loginAcc.movementsDates.push(new Date().toISOString());
    displayMovements(loginAcc);
  }

  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

/////////////////////////////////////////////////////////////////////////////

// IMPLEMENT LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  // Clear input field
  inputLoanAmount.value = '';

  // If loan amount is greater than 0 and there is deposits that over the 10% of loan amount
  if (
    loanAmount > 0 &&
    loginAcc.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    // Add the loan amount into current account
    setTimeout(function () {
      loginAcc.movements.push(loanAmount);
      loginAcc.movementsDates.push(new Date().toISOString());
      displayMovements(loginAcc);
    }, 3000);
  }

  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

/////////////////////////////////////////////////////////////////////////////

// IMPLEMENT CLOSE ACC
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // Find index of account that wish to close using findIndex method
  const closeIndex = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );

  // Clear input field
  inputCloseUsername.value = inputClosePin = '';

  // If pin and username same as login account
  if (
    +inputClosePin.value === loginAcc.pin &&
    inputCloseUsername.value === loginAcc.username
  ) {
    // Delete the specific account in accounts array using splice method
    accounts.splice(closeIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});

/////////////////////////////////////////////////////////////////////////////

// SORT DISPLAY
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(loginAcc, !sort);
  sort = !sort;
});

/////////////////////////////////////////////////////////////////////////////

// DISPLAY ARRAY INTO HTML
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ``;

  console.log(acc);
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  console.log(movs);

  const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const dayPassed = calcDaysPassed(new Date(), date);

    if (dayPassed === 0) return `Today`;
    if (dayPassed === 1) return `Yesterday`;
    if (dayPassed <= 7) return `${dayPassed} days ago`;

    return new Intl.DateTimeFormat(locale, optionsTime).format(date);
  };

  movs.forEach(function (mov, i) {
    const movementType = mov > 0 ? `deposit` : `withdrawal`;
    const date = new Date(acc.movementsDates[i]);
    const movementDate = formatMovementDate(date, acc.locale);
    const html = `
                <div class="movements__row">
                <div class="movements__type movements__type--${movementType}">${
      i + 1
    } ${movementType}</div>
                <div class="movements__date">${movementDate}</div>
                <div class="movements__value">${formatCur(
                  mov,
                  acc.locale,
                  acc.currency
                )}</div>
                </div>
                `;
    //InsertAdjacentHTML
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });

  // ADD UP BALANCE
  const calcBalance = function (acc) {
    acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
    labelBalance.textContent = `${formatCur(
      acc.balance,
      acc.locale,
      acc.currency
    )}`;
  };
  calcBalance(acc);

  // CALCULATE SUMMARY
  const calcSummary = function (acc) {
    const deposits = acc.movements
      .filter(mov => mov > 0)
      .reduce((sum, mov) => sum + mov, 0);
    labelSumIn.textContent = `${formatCur(deposits, acc.locale, acc.currency)}`;

    const withdraws = Math.abs(
      acc.movements.filter(mov => mov < 0).reduce((sum, mov) => sum + mov, 0)
    );
    labelSumOut.textContent = `${formatCur(
      withdraws,
      acc.locale,
      acc.currency
    )}`;

    const interest = acc.movements
      .filter(mov => mov > 0)
      .map(mov => (mov * acc.interestRate) / 100)
      .reduce((sum, mov) => (mov > 1 ? sum + mov : sum), 0);
    labelSumInterest.textContent = `${formatCur(
      interest,
      acc.locale,
      acc.currency
    )}`;
  };
  calcSummary(acc);
};

/////////////////////////////////////////////////////////////////////////////

// CALCULATE OVERALL BALANCE
const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((sum, mov) => sum + mov, 0);

/////////////////////////////////////////////////////////////////////////////

labelBalance.addEventListener('click', function (e) {
  e.preventDefault();

  // GET MOVEMENTS FROM HTML
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => +el.textContent.replace('€', '')
  );
  console.log(movementUI);

  // PAINT ROW
  const allRow = [...document.querySelectorAll('.movements__row')];
  const paintRow = function (rows) {
    rows.forEach(function (row, i) {
      if (i % 2 === 0) row.style.backgroundColor = 'orangered';
      if (i % 3 === 0) row.style.backgroundColor = 'blue';
    });
  };
  paintRow(allRow);
});

/////////////////////////////////////////////////////////////////////////////

// CONVERT DATE AND TIME FORMATconsole.log();
const dateAndTime = function (dateTime) {
  const now = new Date(dateTime);
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);
  return `${day}/${month}/${year}, ${hour}:${min}`;
};

/////////////////////////////////////////////////////////////////////////////

// FAKE ALWAYS LOGIN
// const curAcc = account1;
// displayMovements(curAcc);
// containerApp.style.opacity = 100;

/////////////////////////////////////////////////////////////////////////////
