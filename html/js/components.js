document.addEventListener("DOMContentLoaded", () => {

    fetch("components/header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Header could not be loaded");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("header").innerHTML = data;
        })
        .catch(error => console.error(error));

    fetch("components/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Footer could not be loaded");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(error => console.error(error));

});