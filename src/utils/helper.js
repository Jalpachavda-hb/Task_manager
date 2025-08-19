export const ValidateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const addThousandsSeparator = (num) => {
if (num == null || isNaN(num) ) return "";
const [integerPart, fractionalPart] = num. toString().split(".") ;
const formattedInteger = integerPart. replace(/\B( ?= (\d{3})+( ?! \d))/g, ",");
return fractionalPart
? '${ formattedInteger}.${fractionalPart}'
: formattedInteger;
};