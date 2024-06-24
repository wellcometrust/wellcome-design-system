export const pascalize = (str) => {
 const camel = str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);

  return pascal;
};