$(document).ready(function () {

    $.getJSON('/poems', function (poemData) {

        let allPoems = poemData.map(function (currentPoem) {

            console.log(currentPoem);

            let title = $(`<h5 class="card-title"></h5>`)
                .text(`Title: ${currentPoem.title}`);

            let titleLink = $(`<a href='https://www.theparisreview.org${currentPoem.link}'>`)
                .append(title);

            let author = $(`<h6 class="card-subtitle mb-2 text-muted"></h6>`)
                .text(`Author: ${currentPoem.author}`);

            let excerpt = $(`<p class="card-text">`)
                .text(currentPoem.excerpt);

            let body = $(`<div class="card-body">`)
                .append(titleLink, author, excerpt);

            let card = $(`<div class="card" style="width: 18rem;">`)
                .append(body);

            // FIXME:
            card.data("_id", currentPoem._id);

            $(`.poetry-container`)
                .append(card);

        })
    })

})


