$(document).ready(function(){
    namespace = '/input';
    var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);
    socket.on('connect', function() {
      console.log('connected');
      socket.emit('get room');
    });

    socket.on('button pressed', function(button) {
        $('#log').append('<br>Button pressed: ' + button.data);
        $q = $('.results .'+ button.data);
        $q.addClass('called');
        setTimeout(
          function(){ $q.removeClass('called'); },
          3000
        );
    });


    function emit_key(key){
      //socket.emit('key pressed', {data: key});
    }

    $(document).on("keyup", function(e) {
      if(e.which == 13){
        e.preventDefault();
      }
      console.log(e.which);
      switch(e.which){
        case 49: emit_key('1'); break;
        case 50: emit_key('2'); break;
        case 51: emit_key('3'); break;
      }
    });
});
