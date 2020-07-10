
$.getJSON("/articles", function(data) {
  if (data.length === 0) {
    $("#articles").append("<p>There are no articles!</p>");
  } else {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + 
        "</p>");
        if (data[i].saved === false ){
          $("#articles").append("<button class='btn btn-primary' data-id='" + data[i]._id + "' id='savearticle'>Save Article</button><hr>")
        } else {
          $("#articles").append("<p>This article is already saved!</p><hr>")
        }
    }
  }
});

$.getJSON("/savedarticles", function(data) {
  if (data.length === 0) {
    $("#savedarticles").append("<p>Please save some articles!</p>");
  } else {
  for (var i = 0; i < data.length; i++) {
    $("#savedarticles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + 
    "</p><button class='btn btn-primary save' data-id='" + data[i]._id + 
    "' id='removearticle'>Remove Article</button><button class='btn btn-primary save' data-id='" + data[i]._id +
    "' id='addnote'>Add Note</button><button class='btn btn-primary save' data-id='" + data[i]._id +
    "' id='seenotes'>See Notes</button><hr>"); 
}
  }
});

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
