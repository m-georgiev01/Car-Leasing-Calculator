const INTEREST_RATE_BRAND_NEW = 2.99;
const INTEREST_RATE_USED = 3.7;

const inputSelectors = {
  carType: document.querySelector('#carType'),
  carValue: document.querySelector('#carValue'),
  carValueRange: document.querySelector('#carValueRange'),
  leasePeriod: document.querySelector('#leasePeriod'),
  downPayment: document.querySelector('#downPayment'),
  downPaymentRange: document.querySelector('#downPaymentRange'),
};

const leaseDetailsTextSelectors = {
  totalLease: document.querySelector('#total-lease'),
  downPayment: document.querySelector('#down-payment'),
  monthlyInstallment: document.querySelector('#monthly-installment'),
  interestRate: document.querySelector('#interest-rate'),
};

const errorSpansSelectors = {
  carType: document.querySelector('#error-car-type'),
  carValue: document.querySelector('#error-car-value'),
  carValueRange: document.querySelector('#error-car-value-range'),
  leasePeriodDuration: document.querySelector('#error-lease-period-duration'),
  leasePeriodIncrements: document.querySelector(
    '#error-lease-period-increments'
  ),
  downPaymentDuration: document.querySelector(
    '#error-down-payment-input-duration'
  ),
  downPaymentIncrements: document.querySelector(
    '#error-down-payment-input-increments'
  ),
  downPaymentRangeDuration: document.querySelector(
    '#error-down-payment-range-duration'
  ),
  downPaymentRangeIncrements: document.querySelector(
    '#error-down-payment-range-increments'
  ),
};

function attachEvents() {
  inputSelectors.carType.addEventListener('change', handleCarTypeChange);
  inputSelectors.carValue.addEventListener('input', handleCarValueInputChange);
  inputSelectors.carValueRange.addEventListener(
    'input',
    handleCarValueRangeChange
  );
  inputSelectors.leasePeriod.addEventListener(
    'change',
    handleLeasePeriodChange
  );
  inputSelectors.downPayment.addEventListener(
    'input',
    handleDownPaymentInputChange
  );
  inputSelectors.downPaymentRange.addEventListener(
    'input',
    handleDownPaymentRangeChange
  );
}

function handleCarTypeChange() {
  if (
    inputSelectors.carType.value !== 'Brand New' &&
    inputSelectors.carType.value !== 'Used'
  ) {
    errorSpansSelectors.carType.hidden = false;
  } else {
    errorSpansSelectors.carType.hidden = true;
    Calculate();
  }
}

function handleCarValueInputChange() {
  const currValue = Number(inputSelectors.carValue.value);

  if (currValue < 10000 || currValue > 200000) {
    errorSpansSelectors.carValue.hidden = false;
  } else {
    errorSpansSelectors.carValue.hidden = true;
    inputSelectors.carValueRange.value = currValue;
    Calculate();
  }
}

function handleCarValueRangeChange() {
  const currValue = Number(inputSelectors.carValueRange.value);

  if (currValue < 10000 || currValue > 200000) {
    errorSpansSelectors.carValueRange.hidden = false;
  } else {
    errorSpansSelectors.carValueRange.hidden = true;
    inputSelectors.carValue.value = currValue;
    Calculate();
  }
}

function handleLeasePeriodChange() {
  const currValue = Number(inputSelectors.leasePeriod.value);

  if (currValue < 12 || currValue > 60) {
    errorSpansSelectors.leasePeriodDuration.hidden = false;
    return;
  }

  if (currValue % 12 !== 0) {
    errorSpansSelectors.leasePeriodIncrements.hidden = false;
    return;
  }

  errorSpansSelectors.leasePeriodDuration.hidden = true;
  errorSpansSelectors.leasePeriodIncrements.hidden = true;
  Calculate();
}

function handleDownPaymentInputChange() {
  const currValue = Number(inputSelectors.downPayment.value);

  if (currValue < 10 || currValue > 50) {
    errorSpansSelectors.downPaymentDuration.hidden = false;
    return;
  }

  if (currValue % 5 !== 0) {
    errorSpansSelectors.downPaymentIncrements.hidden = false;
    return;
  }

  errorSpansSelectors.downPaymentDuration.hidden = true;
  errorSpansSelectors.downPaymentIncrements.hidden = true;
  inputSelectors.downPaymentRange.value = currValue;
  Calculate();
}

function handleDownPaymentRangeChange() {
  const currValue = Number(inputSelectors.downPaymentRange.value);

  if (currValue < 10 || currValue > 50) {
    errorSpansSelectors.downPaymentRangeDuration.hidden = false;
    return;
  }

  if (currValue % 5 !== 0) {
    errorSpansSelectors.downPaymentRangeIncrements.hidden = false;
    return;
  }

  errorSpansSelectors.downPaymentRangeDuration.hidden = true;
  errorSpansSelectors.downPaymentRangeIncrements.hidden = true;
  inputSelectors.downPayment.value = currValue;
  Calculate();
}

function Calculate() {
  //insterest
  const currInterestRate =
    inputSelectors.carType.value === 'Brand New'
      ? INTEREST_RATE_BRAND_NEW
      : INTEREST_RATE_USED;

  leaseDetailsTextSelectors.interestRate.textContent =
    leaseDetailsTextSelectors.interestRate.textContent.split(':')[0] +
    ': ' +
    currInterestRate.toFixed(2) +
    '%';

  //down payment
  const carTotalValue = Number(inputSelectors.carValue.value);
  const downPaymentPercentage = Number(inputSelectors.downPayment.value) / 100;
  const downPayment = carTotalValue * downPaymentPercentage;

  leaseDetailsTextSelectors.downPayment.textContent =
    leaseDetailsTextSelectors.downPayment.textContent.split('€')[0] +
    '€' +
    downPayment.toFixed(2);

  //monthly
  const monthlyInterestRate = currInterestRate / 100 / 12;
  const leasePeriod = Number(inputSelectors.leasePeriod.value);
  const valueAfterDownPayment = carTotalValue - downPayment;

  //formula -> monthly = (valueAfterDownPayment * monthlyInterestRate * (1 + monthlyInterestRate)^leasePerios)
  //                     -------------------------------------------------------------------------------------
  //                                       (1 + monthlyInterestRate) ^ leasePeriod - 1

  const monthlyInstallment =
    (valueAfterDownPayment *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, leasePeriod)) /
    (Math.pow(1 + monthlyInterestRate, leasePeriod) - 1);

  leaseDetailsTextSelectors.monthlyInstallment.textContent =
    leaseDetailsTextSelectors.monthlyInstallment.textContent.split('€')[0] +
    '€' +
    monthlyInstallment.toFixed(2);

  //total
  const total = monthlyInstallment * leasePeriod + downPayment;

  leaseDetailsTextSelectors.totalLease.textContent =
    leaseDetailsTextSelectors.totalLease.textContent.split('€')[0] +
    '€' +
    total.toFixed(2);
}

Calculate();
attachEvents();
