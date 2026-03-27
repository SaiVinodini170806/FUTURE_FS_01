function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

document.getElementById("contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const status = document.getElementById("status");

    try {
        const response = await fetch("http://localhost:3000/send-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            status.innerText = "Message sent successfully!";
            status.style.color = "green";
            document.getElementById("contact-form").reset();
        } else {
            status.innerText = data.error || "Failed to send message";
            status.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        status.innerText = "Server not reachable!";
        status.style.color = "red";
    }
});