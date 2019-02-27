
$(document).ready(function () {

    $.getJSON('/poems', function (poemData) {

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

    $(document).on(`click`, `.card`, function () {

        // $(`note`).empty();

        let thisId = $(this).attr("data-id");
        // This prints to the console with the correct id 
        console.log(`this is the id line 41 app.js: `, thisId);

        axios.get(`/poems/${thisId}`).then(function (response) {
            let thisPoem = response.data
            console.log(thisPoem);

            $(".note-container").append("<h2>" + thisPoem.title + "</h2>");
            // An input to enter a new title
            $(".note-container").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $(".note-container").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $(".note-container").append("<button data-id='" + thisPoem._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (thisPoem.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(thisPoem.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(thisPoem.note.body);
            }
        })

    })

    // $(document).on(`click`, `.card`, () => {

    //     $(`notes`).empty();

    //     let thisId = $(this).attr(`data-id`);
    //     console.log(`this is the id line 41 app.js: `, thisId);

    //     axios.get(`/poems/:id`).then((response) => {
    //         console.log(response.data);
    //     })

    // })

})


