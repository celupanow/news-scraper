//displaying all the scraped articles on the main page
$.getJSON("/articles", function(data) {
  //if there are no articles, display that there are no articles
  if (data.length === 0) {
    $("#articles").append("<p>There are no articles!</p>");
  } else {
    //if there are articles, run through all of the articles and display each one
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + 
        "</p>");
        //if the article is not saved, display the save button
        //otherwise display that the article is already saved
        if (data[i].saved === false ){
          $("#articles").append("<button class='btn btn-primary' data-id='" + data[i]._id + "' id='savearticle'>Save Article</button><hr>")
        } else {
          $("#articles").append("<p>This article is already saved!</p><hr>")
        }
    }
  }
});

//displaying all the saved articles on the saved page
$.getJSON("/savedarticles", function(data) {
  //if no articles have been saved, ask the user to save some
  if (data.length === 0) {
    $("#savedarticles").append("<p>Please save some articles!</p>");
  } else {
    //if there are articles, display each one with a button to add a note, see the notes, and remove the article from saved
  for (var i = 0; i < data.length; i++) {
    $("#savedarticles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + 
    "</p><button class='btn btn-primary save' data-id='" + data[i]._id + 
    "' id='removearticle'>Remove Article</button><button class='btn btn-primary save' data-id='" + data[i]._id +
    "' id='addnote'>Add Note</button><button class='btn btn-primary save' data-id='" + data[i]._id +
    "' id='seenotes'>See Notes</button><hr>"); 
}
  }
});

//when the addnote button is clicked, display the adding a note form
$(document).on("click", "#addnote", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<p>Note Title: <input id='titleinput' name='title' ></p><br>");
      $("#notes").append("<p>Note Body: <textarea id='bodyinput' name='body'></textarea></p>");
      $("#notes").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      


    });
});

//when the save note button is clicked, save that note to the specific article
$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
     $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  //when the see notes button is clicked, display the notes related to that article
  $(document).on("click", "#seenotes", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data) {

    if (data.note) {
      $("#notes").append("<h3>" + data.note.title + "</h3>");
      $("#notes").append("<p>" + data.note.body + "</p>");
    } else {
      $("#notes").append("<p>No notes to display!</p>");
    }
  });
  });

  //when the save button is clicked, save the article
  $(document).on("click", "#savearticle", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/save/" + thisId,
      data: { saved: true }
    })
    .done(function(data) {
      $("#savearticle").attr("disabled", true);
    })
    
  });

  //when the remove button is clicked, remove the article from the saved articles
  $(document).on("click", "#removearticle", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/remove/" + thisId,
      data: { saved: false}
    })
    .done(function(data) {
      window.location = "/saved"
    })
  });
