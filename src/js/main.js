var QUESTIONS = [
  {
    "question": "Wiecej niz jedno zwierze?",
    "answers": [
      {
        "answer": "Owca",
        "score": "51"
      },
      {
        "answer": "Lama",
        "score": "44"
      }
    ]
  }
];

var current_question = -1;
var scores = {
  "left": 0,
  "right": 0,
  'total': 0
};
var activeTeam = null;
var errors = 0;

$(document).ready(function(){
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
        return this
      };
    })(jQuery);

    (function($){
      $.fn.addError = function(big = false){
        $e = $('<div/>', {
          "class": "x",
          "html": "x"
        });
        if(big)
          $e.addClass('big');
        $e.appendTo(this);
      }
    })(jQuery);

    function fillAnswer(number){
      try{
        var $answer = $("#answer"+(number-1).toString());
        var answer_data = QUESTIONS[current_question].answers[number-1]
        $answer.addClass('filled');
        $answer.find(".text").html(answer_data.answer);
        $answer.find(".score").html(answer_data.score);
      }
      catch(TypeError){
        console.log('No such answer');
      }
    };

    function setDisplayScore(score, side = null){
      if(!side){
        $('.results .total').html("0");
        return;
      }
      var $result = $('.results .' + side)
      $result.html(score.toString());
    }

    function addScore(score, side = null){
      if(!side){
        scores.total += score;
        setDisplayScore(scores.total);
        return;
      }
      scores[side] += score;
      setDisplayScore(scores[side], side);
    }

    function displayNextQuestion(){
      current_question++;
      var $questionList = $('.main');
      // show first question
      $('<h1/>', { "html": QUESTIONS[current_question].question }).appendTo($questionList);

      // show answer list for question
      for(var i = 1; i <= QUESTIONS[current_question].answers.length; i++){
        $questionList.addAnswer(i);
      }
    }


    /* game setup */
    setDisplayScore(scores.left, 'left');
    setDisplayScore(scores.right, 'right');
    setDisplayScore(scores.total);







    /* Network communication logic */

    namespace = '/input';

    var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

    // setup connection
    socket.on('connect', function() {
      console.log('connected');
      socket.emit('get room');
    });

    // waiting for button to be hit and showing result
    socket.on('button pressed', function(button) {
        $('#log').append('<br>Button pressed: ' + button.data);
        $q = $('.results .'+ button.data);
        $q.addClass('called');
        setTimeout(
          function(){ $q.removeClass('called'); },
          3000
        );
    });

    $(document).on("keyup", function(e) {
      if(e.which == 32 || e.which == 13){
        e.preventDefault();
      }
      console.log(e.which);
      switch(e.which){
        case 49: fillAnswer('1'); break;
        case 50: fillAnswer('2'); break;
        case 51: fillAnswer('3'); break;
        case 52: fillAnswer('4'); break;
        case 53: fillAnswer('5'); break;
        case 54: fillAnswer('6'); break;
        case 65: $('.questions .left').addError(); break;
        case 83: $('.questions .left').addError(true); break;
        case 68: $('.questions .left').html(""); break;
        case 76: $('.questions .right').addError(); break;
        case 75: $('.questions .right').addError(true); break;
        case 74: $('.questions .right').html(""); break;
        case 32: displayNextQuestion();
      }
    });
});
