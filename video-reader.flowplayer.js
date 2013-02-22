

$(function() {
 var resource_url = $.url().param("url")
  $.getJSON(resource_url + "/meta.json", function(data) {

    // Set the size of the player for the user's screen
    // setInterval(function() { using an interval doesn't work as well as you would expect...
      var aspectRatio = data.width / data.height
      var dimensions = findOptimalResolutionForScreen(aspectRatio)
      $('.player').width(dimensions.width)
      $('.player').height(dimensions.height)
    // }, 1000)

    $(".player video").html("<source type='video/webm' src='" + resource_url + "/" + data.filename + "'/>")

    $(".player").attr("data-cuepoints", JSON.stringify(data.cuepoints.pageturns))

    // Initialize the player
    var player = $(".player").flowplayer({"generate_cuepoints": true});
    

    


  })
 
});

/*
 * http://flowplayer.org/docs/api.html
 * Flowplayer hook
 */
flowplayer(function(api, root) {
 
  // when a new video is about to be loaded
  api.bind("cuepoint", function(e, api, cuepoint) {

    console.log(cuepoint)

    var destinationPage = cuepoint.index, 
      nextPage, 
      previousPage
    ;

    var lastPage = -1
    $(".video-reader-pager .fp-cuepoint").each(function() {
      lastPage++
    })

    // Depending on what page we are on will affect what is the next and previous
    // pages.
    if(destinationPage > lastPage) {
      // Go back to the beginning
      destinationPage = 0
      nextPage = 1
      previousPage = lastPage
    }
    else if (destinationPage < 0) {
      // Go to the last page
      destinationPage = lastPage
      nextPage = 0
      previousPage = lastPage - 1
    }
    else if (destinationPage < lastPage)  {
      // proceed 
      nextPage = destinationPage + 1
      previousPage = destinationPage - 1
    }

    // Clear the pager
    $(".fp-cuepoint").text("")
    $(".fp-cuepoint").removeClass("previous-page")
    $(".fp-cuepoint").removeClass("next-page")
    $(".fp-cuepoint").removeClass("current-page")

    // Set the links
    $(".fp-cuepoint" + previousPage).text("<").addClass("previous-page")
    $(".fp-cuepoint" + destinationPage).text("Page " + (destinationPage + 1)).addClass("current-page")
    $(".fp-cuepoint" + nextPage).text(">").addClass("next-page")

  // when a video is loaded and ready to play
  }).bind("ready", function() {

    /*
     * Build out the pager
     */

    // Add Page Numbers for the cuepoints
    var currentPage = 0
    var lastPage = -1
    $(".video-reader-pager .fp-cuepoint").each(function() {
      lastPage++
    })

    $(".fp-cuepoint" + lastPage).text("<").addClass("previous-page")
    $(".fp-cuepoint" + currentPage).text("Page " + (currentPage + 1)).addClass("current-page")
    $(".fp-cuepoint" + (currentPage + 1)).text(">").addClass("next-page")

  });
 
});
