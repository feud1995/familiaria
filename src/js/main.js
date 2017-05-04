var QUESTIONS = null;
var DISPLAY_QUESTION = false;
var MEDIA = false;

var current_question = -1;
var scores = {
  "left": 0,
  "right": 0,
  'total': 0
};
var activeTeam = null;
var errors = 0;
var sumPoints = true;

/* due to copyright you need to provide them yourself - sorry */
$(document).ready(function(){
    /* sounds */
    if(MEDIA){
      var acorrect = new Howl({ src: '/static/media/correct.mp3' });
      var aerror = new Howl({ src: '/static/media/error.mp3' });
      var around = new Howl({ src: '/static/media/round.mp3' });
      var aending = new Howl({ src: '/static/media/ending.mp3' });
      var apresent = new Howl({ src: '/static/media/present.mp3' });
      var abutton = new Howl({ src: '/static/media/button.mp3' });

      $('#intro').on('ended', function(e){
        $(this).fadeOut(function(){ $("main").fadeIn(); });
        apresent.play();
      });
    }
    else{
      $('#intro').hide();
      $("main").fadeIn();
    }

    /* Game logic functions */

    (function( $ ){
      $.fn.addAnswer = function(number){
        var $answer = $('<div/>', {
          'class': "answer",
          'id': "answer"+(number-1).toString()
        });

        var $number = $('<div/>', {
          "class": "number",
          "text": number
        });

        var $text = $('<div/>', {
          'class': "text"
        });

        var $score = $('<div/>', {
          'class': "score"
        });

        $number.appendTo($answer);
        $text.appendTo($answer);
        $score.appendTo($answer);

        $answer.appendTo(this);
        return this;
      };
    })(jQuery);

    (function($){
      $.fn.addError = function(big){
        if(MEDIA) aerror.play();
        big = typeof big  === 'undefined' ? false : big;
        $e = $('<div/>', {
          "class": "x",
          "html": "x"
        });
        if(big)
          $e.addClass('big');
        $e.appendTo(this);
        errors++;
      };
    })(jQuery);

    (function($){
      $.fn.clearError = function(){
        this.html("");
        errors = 0;
      };
    })(jQuery);


    function setDisplayScore(score, side){
      side = typeof side === 'undefined' ? null : side;
      if(!side){
        $('.results .total').html(score.toString());
        return;
      }
      var $result = $('.results .' + side);
      $result.html(score.toString());
    }

    function addScoreTotal(score){
      if(!sumPoints) // return if not suppose sum them
        return;

      scores.total += parseInt(score);
      console.log("INFO: New total: "+scores.total);
      setDisplayScore(scores.total);
      return;
    }

    function addTeamScore(side){
      scores[side] += scores.total; // add new total
      setDisplayScore(scores[side], side); // display new value
      scores.total = 0; // set total to 0
      setDisplayScore(0); // reset display of total
      sumPoints = false;
    }



    function fillAnswer(number){
      try{
        if(MEDIA) acorrect.play();
        var $answer = $("#answer"+(number-1).toString());
        var answer_data = QUESTIONS[current_question].answers[number-1];
        $answer.addClass('filled');
        $answer.find(".text").html(answer_data.answer);
        $answer.find(".score").html(answer_data.score);
        addScoreTotal(answer_data.score);
      }
      catch(TypeError){
        console.log('No such answer');
      }
    }



    function displayNextQuestion(){
      // reset total
      scores.total = 0;
      setDisplayScore(0);
      sumPoints = true;

      current_question++;
      var $questionList = $('.main');
      $questionList.html("");
      try{
        // show question if set
        if(DISPLAY_QUESTION)
          $('<h1/>', { "html": QUESTIONS[current_question].question }).appendTo($questionList);

        // show answer list for question
        for(var i = 1; i <= QUESTIONS[current_question].answers.length; i++){
          $questionList.addAnswer(i);
        }
        if(MEDIA) around.play();
      }
      catch(TypeError){
        console.log("No more questions");
        if(MEDIA) aending.play();
      }
    }

    /* Network communication logic */

    namespace = '/input';

    var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

    // setup connection with sockets
    socket.on('connect', function() {
      console.log('connected');
      socket.emit('get room');
    });

    // setting socket wait for button to be hit and showing result
    socket.on('button pressed', function(button) {
      $('#log').append('<br>Button pressed: ' + button.data);
      if(MEDIA) abutton.play();
      $q = $('.results .'+ button.data);
      $q.addClass('called');
      setTimeout(
        function(){ $q.removeClass('called'); },
        3000
      );
    });

    /* game setup */
      // Get JSON data with questions
      $.getJSON("http://localhost:5000/get_questions", function(data){
        QUESTIONS = data;
        if(!QUESTIONS)
          alert("No questions in the base!");
      });

      // set scores to starting positions
      setDisplayScore(scores.left, 'left');
      setDisplayScore(scores.right, 'right');
      setDisplayScore(scores.total);

    /* game starts now and we wait for the moderator keys */

    $(document).on("keyup", function(e) {
      if(e.which == 32 || e.which == 13){
        e.preventDefault();
      }
      console.log(e.which);
      switch(e.which){
        case 49: fillAnswer('1'); break; // 1
        case 50: fillAnswer('2'); break; // 2
        case 51: fillAnswer('3'); break; // 3
        case 52: fillAnswer('4'); break; // 4
        case 53: fillAnswer('5'); break; // 5
        case 54: fillAnswer('6'); break; // 6
        case 65: $('.questions .left').addError(); break; // a
        case 83: $('.questions .left').addError(true); break; // s
        case 68: $('.questions .left').clearError(); break; // d
        case 76: $('.questions .right').addError(); break; // l
        case 75: $('.questions .right').addError(true); break; // k
        case 74: $('.questions .right').clearError(); break; // j
        case 32: displayNextQuestion(); break; // space
        case 37: addTeamScore('left'); break; // left arrow
        case 39: addTeamScore('right'); break; // right arrow
        case 77: around.play(); break;
        case 78: around.stop(); break;
        case 188: aending.play(); break;
        case 190: aending.stop(); break;
      }
    });
});
