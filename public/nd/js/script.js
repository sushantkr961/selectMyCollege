function updateRangeBackground(input) {
  const value = input.value;
  const max = input.max;
  const percent = (value / max) * 100;
  input.style.background = `linear-gradient(to right, #1eb2a6, #1eb2a6 ${percent}%, #ebebeb ${percent}%, #ebebeb)`;
  document.getElementById("fee").innerHTML = value;
}
// Set the initial background color
const rangeInput = document.getElementById("feeRange");
updateRangeBackground(rangeInput);
