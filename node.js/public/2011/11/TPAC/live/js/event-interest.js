jQuery(document).ready(function ($) {
    $("a.interest").live("click", function() {
     var self = this;
     var postData = {"_format": "json"};
     if ($("img",$(self)).attr("src").indexOf("-off") != -1) {
        postData["interested"] = "interested";
      } else {
        postData["uninterested"] = "uninterested";
      }	

    $.post($(self).attr("href"),
    postData,
    function(data) {
      // data.error vs data.success
	var result = JSON.parse(data);
	if (result.success) {
        if (postData["uninterested"]) {
	    var img = $("img", "a.interest[href='" + $(self).attr("href") + "']");
	    img.attr("src", $("img",$(self)).attr("src").replace(".png", "-off.png"));	    
	    img.attr("alt", "Not marked as interested");
	    $("dd.mySchedule a[href='" + $(self).attr("href") + "']").parent().remove();
	} else {
	   $("img",$(self)).attr("src", $("img",$(self)).attr("src").replace("-off.png", ".png"));
	    $("img",$(self)).attr("alt", "Marked as interested");
	    var event = $(self).parent().clone();
	    event.addClass("mySchedule lastAdded");
	    if ($("dd.mySchedule.lastAdded").length) {
		    $("dd.mySchedule.lastAdded").removeClass("lastAdded").after(event);
	    } else {
		$("#mySchedule + dd").after(event);
	    }
	}      
     }
   });
   return false;
  });

if (window.EventSource) {
	  var evtSrc = new EventSource( "/schedule/stream" );
    evtSrc.addEventListener("interest", function( e ) {
	    var data = JSON.parse(e.data);
	      $("em[data-eventid='" + data.event.slug + "']").each(function() {
		  var interested = $(this);
		  if (interested.text()!= "") {
		      var counter = parseInt($("span", interested)) || 0;
		      $("span", interested).text(counter + 1);
		  } else {
		      interested.text("(");
		      interested.append($("<span></span>").text("1"));
		      interested.append(" interested to attend)");
		  }
	      });	    
    }, false);
    evtSrc.addEventListener("uninterest", function( e ) {
	    var data = JSON.parse(e.data);
	      $("em[data-eventid='" + data.event.slug + "']").each(function() {
		  var interested = $(this);
		  if (interested.text()) {
		      var interestedCounter = parseInt($("span", interested));
		      if (interestedCounter > 1) {
			  $("span", interested).text(interestedCounter - 1);
		      } else {
			  interested.text("");
		      }
		  } 
	      });	    
    }, false);

}

});