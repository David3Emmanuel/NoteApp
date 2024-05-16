const container = document.getElementById('container');

function addNote({ title, note, date, image: imageSrc }) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note');

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title-container');

    const h3 = document.createElement('h3');
    h3.innerText = title;
    titleContainer.appendChild(h3);

    const dateP = document.createElement('p');
    dateP.innerText = new Date(date).toLocaleDateString();
    titleContainer.appendChild(dateP);

    noteContainer.appendChild(titleContainer);

    if (imageSrc) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const image = document.createElement('img');
        image.src = "/uploads/" + imageSrc;

        imageContainer.appendChild(image);
        noteContainer.appendChild(imageContainer);
    }

    const p = document.createElement('p');
    p.innerText = note;
    noteContainer.appendChild(p);

    container.appendChild(noteContainer);
}

fetch("/api/notes")
    .then(response => response.json())
    .then(notes => {
        notes.reverse().forEach(addNote);
    });