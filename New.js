const form = document.querySelector("#login-form");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#password-toggle");
const feedback = document.querySelector("#form-feedback");

passwordToggle.addEventListener("click", () => {
	const isPassword = passwordInput.type === "password";
	passwordInput.type = isPassword ? "text" : "password";
	passwordToggle.textContent = isPassword ? "Hide" : "Show";
	passwordToggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
});

form.addEventListener("submit", (event) => {
	event.preventDefault();
	feedback.textContent = "Your details look good. Sign-in is not connected yet.";
	feedback.hidden = false;
});

document.querySelector("#forgot-password").addEventListener("click", (event) => {
	event.preventDefault();
	feedback.textContent = "Password recovery is not connected yet. Please contact your administrator.";
	feedback.hidden = false;
});
