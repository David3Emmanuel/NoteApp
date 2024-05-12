fetch('/api/ip')
.then(response => response.json())
.then(data => {
    const p = document.createElement('p');
    p.innerText = "Access your notes at " + data.ip;
    p.style.fontSize = "10px";

    const container = document.getElementById('container');
    container.prepend(p);
})