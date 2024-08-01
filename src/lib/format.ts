export const formatPrice = (code: number) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
  return formatter.format(code);
};
