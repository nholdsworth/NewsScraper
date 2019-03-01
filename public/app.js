
$(document).ready(function () {

    let poetryContainer = $(`.poetry-container`);

    $.getJSON('/poems', function (poemData) {
        // poetryContainer.empty()
        // if ()
        let allPoems = poemData.map(function (currentPoem) {

            console.log(currentPoem);

            let title = $(`<h5 class="card-title"></h5>`)
                .text(`Title: ${currentPoem.title}`);

            let titleLink = $(`<a href='https://www.theparisreview.org${currentPoem.link}'>`)
                .append(title);

            let author = $(`<h6 class="card-subtitle mb-2 text-muted"></h6>`)
                .text(`${currentPoem.author}`);

            let excerpt = $(`<p class="card-text">`)
                .text(currentPoem.excerpt);

            let body = $(`<div class="card-body">`)
                .append(titleLink, author, excerpt);

            let id = currentPoem._id;
            console.log(id);

            let card = $(`<div class="card" style="width: 18rem;" data-id=${id}>`)
                .append(body);

            $(`.poetry-container`)
                .append(card);

        })

    });

    $(document).on('click', '.card', function () {

        // $(`note`).empty();

        let thisID = $(this).attr('data-id');
        // This prints to the console with the correct id 
        console.log(`this is the id line 41 app.js: `, thisID);

        axios.get(`/poems/${thisID}`).then(function (response) {
            let thisPoem = response.data
            console.log(`this is the console.log on line 48 in app.js`, thisPoem);

            $(".note-container").append(`<h2>${thisPoem.title}</h2>`);
            // An input to enter a new title
            $(".note-container").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $(".note-container").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $(".note-container").append("<button data-id='" + thisPoem._id + "' id='savenote'>Save Note</button>");


            let poemNote = thisPoem.note;
            console.log(`this is poemNote = thisPoem.note checking to see if the poemNote variable is working:`, poemNote);
            // If there's a note in the article
            if (poemNote) {
                console.log(poemNote.title);
                // Place the title of the note in the title input
                $('#titleinput').val(poemNote.title);
                // Place the body of the note in the body textarea
                $('#bodyinput').val(poemNote.body);
            }
        })
    })

    $(document).on('click', '#savenote', function () {

        let thisID = $(this).attr('data-id')

        console.log(`this is the console log from the save button ${thisID}`);

        axios.post(`/poems/${thisID}`, {
            // Value taken from note textarea
            title: $('#titleinput').val(),
            // Value taken from note textarea
            body: $('#bodyinput').val()
        })
            .then(function (response) {
                // FIXME:This is not coming back how I expect.  I expect to see the note
                console.log(`this is the axios.post on line 81 in app.js: `, response.data);
                // Empty the notes section
                $('#notes').empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $('#titleinput').val("");
        $('#bodyinput').val("");
    })
})


