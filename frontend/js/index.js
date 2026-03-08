// Form submit handler
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); 

    const selectedRole = document.getElementById("role").value;
    const greetingDiv = document.getElementById("greeting");

    if (selectedRole === "farmer") {
      greetingDiv.innerHTML = "🌱 Welcome, Farmer! Ready to upload your crops?";
      greetingDiv.style.color = "#28a745"; 
      greetingDiv.style.opacity = 0;
      fadeIn(greetingDiv);
    } else if (selectedRole === "agronomist") {
      greetingDiv.innerHTML = "🧑‍🌾 Welcome, Agronomist! Check your dashboard.";
      greetingDiv.style.color = "#007bff"; 
      greetingDiv.style.opacity = 0;
      fadeIn(greetingDiv);
    } else {
      alert("Please select a role.");
    }
  });


document.getElementById("showPassword").addEventListener("change", function () {
  const passwordField = document.getElementById("password");
  passwordField.type = this.checked ? "text" : "password";
});


function fadeIn(element) {
  let opacity = 0;
  const timer = setInterval(() => {
    if (opacity >= 1) clearInterval(timer);
    element.style.opacity = opacity;
    opacity += 0.05;
  }, 30);
}
