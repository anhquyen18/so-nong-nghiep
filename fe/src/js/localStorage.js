function setItem(key, value) {
  localStorage.setItem(key, value);
}

function removeItem(key) {
  localStorage.removeItem(key);
}

function getItem(key) {
  const token = localStorage.getItem(key);
  if (token) return token;
  return "";
}

export { setItem, getItem, removeItem };
