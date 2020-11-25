
//happens before window load!!!!!
$(document).ready(function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
  $("body").overflow = "hidden";

  //display and hide the current projects
  $(".currently").on('click', function(e) {

    let el = document.getElementById("drop_inner");
    if (el.style.maxHeight == "300px") {
      el.style.maxHeight = "0px";
    } else {
      el.style.maxHeight = "300px";
    }

  });

  //Click function
  // Add smooth scrolling to all links on click
  $("a.top_nav_link").on('click', function(e) {
    // Make sure this.hash has a value before overriding default behavior
      // if (this.hash !== "") {
          // Prevent default anchor click behavior
          // e.preventDefault();
      // Store hash
        // var hash = this.hash;
        $('a.top_nav_link').removeClass('selected');
        $(this).toggleClass('selected');
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (600) specifies the number of milliseconds it takes to scroll to the specified area
        // $('html, body').animate({
        //     scrollTop: $(hash).offset().top
        // }, 800, function(){
        // Add hash (#) to URL when done scrolling (default click behavior)
            // window.location.hash = hash;
          // });
        // } // End if
  });

  //Scroll Function
  //adds and removes selected class when the section is reached with the scroll
    $(document).bind('scroll',function(e){
      $('section').each(function(){
          if ($(this).offset().top < window.pageYOffset + 10 && $(this).offset().top + $(this).height() > window.pageYOffset + 10){
            // window.location.hash = $(this).attr('id');
              if($(this).attr('id') == "projects"){
                  $('a.top_nav_link').removeClass('selected');
                  $("#nav1").toggleClass('selected')
              } else if($(this).attr('id') == "play"){
                  $('a.top_nav_link').removeClass('selected');
                  $("#nav2").toggleClass('selected')
              } else if($(this).attr('id') == "about"){
                  $('a.top_nav_link').removeClass('selected');
                  $("#nav3").toggleClass('selected')
              }
          }
      });
    });


  //Scroll Bug function
  // fixes the bug that caused scrolling up to be faster
  // function wheel(event) {
  //   var delta = 0;
  //   if (event.wheelDelta) {(delta = event.wheelDelta / 100);}
  //   else if (event.detail) {(delta = -event.detail / 30);}
  //   handle(delta);
  //commented out because it caused bug in DOM
    // if (event.preventDefault) {(event.preventDefault());}
    // event.returnValue = false;
  // }

  // function handle(delta) {
  //   var time = 1000;
  //   var distance = 300;
  //   $('html, body').stop().animate({
  //       scrollTop: $(window).scrollTop() - (distance * delta)
  //   }, time );
  // }

  // if (window.addEventListener) {window.addEventListener('DOMMouseScroll', wheel, false);}
  //   window.onmousewheel = document.onmousewheel = wheel;

});

//code for the scrolling effects adapted from
//https://medium.com/@josephharwood_62087/how-to-make-a-navbar-with-text-color-changing-on-scrolling-and-clicking-with-html-css-jquery-4ffddcdf5f41
