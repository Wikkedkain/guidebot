
async function getCommands() {
  let response = await fetch('/commands');
  let data = await response.json();
  return data;
}