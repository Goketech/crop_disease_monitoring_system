document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // to prevent the page from reloading

    const selectedRole = document.getElementById("role").value;

    if (selectedRole === "farmer") {
      alert("Success! Routing to Farmer Upload Screen...");
      // In the future, this will be: window.location.href = 'farmer.html';
    } else if (selectedRole === "agronomist") {
      alert("Success! Routing to Agronomist Dashboard...");
      // In the future, this will be: window.location.href = 'dashboard.html';
    } else {
      alert("Please select a role.");
    }
  });
