// Checkers Game by Lamia Demirok

// Colors that will be used for pieces are identified
const colors = ["red", "black"];

//I created a class to identify players' id, name and colors.
class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}
//I declared two players as p1 and p2, then I will assign them to player class.
//I also added current_player variable, which will be used to determine which player will make a move.
    $(function () {
        var p1, p2, current_player;

        //when someone clicks the "new game" button, the page reloads again and a new game starts
        $('#newgame').on('click', function () {
            location.reload();
        });
        //css edit for the button, changes background and text color when mouse is on and when leaves.

        $('#howtoplay a').on('mouseover' ,function() {
            $(this).css({
                "color": "antiquewhite"
            });
        });
        $('#howtoplay a').on('mouseleave' ,function() {
            $(this).css({
                "color": "#806157"
            });
        });

        $('#newgame,#howtoplay').on({
            mouseover : function(){
                $(this).css({
                    "background-color": "#806157",
                    "color": "antiquewhite",
                    "cursor": "pointer"
                });
          },

            mouseleave : function(){
                $(this).css({
                    "background-color":"antiquewhite",
                    "color":"#806157"
                });
            }
        });
        //There is a modal screen that asks the users to enter their names. As a result, the entered names are displayed instead of
        // "Player 1" and "Player 2" texts. If the user doesn't enter a name or clicks the "x" button, there will be no change.
        //This function changes the modal box's display from none to block and makes it show up on the page.
        $(function(){
            $("#modalWindow").css("display","block");
        });

        //When user clicks "play" button on the modal page, the modal fades out and changes the value of Player 1 and Player 2
        //Then, the prepareGame function starts working and it prepares the game, background,pieces,texts
        $(".play").click(function(){
            $("#modalWindow").fadeOut();
            //assigned the inputs to variables
            var firstPlayerName = document.getElementById("firstplayer").value;
            var secondPlayerName = document.getElementById("secondplayer").value;

            //player name has to contain letters. Checked it by testing their lowercase and uppercase versions.
            //If they aren't the same, then it identifies that input contains letter(s) and then the "Player1" or "Player2" titles change.
            if(firstPlayerName.toUpperCase() != firstPlayerName.toLowerCase())
                document.getElementById("p1text").innerText = firstPlayerName;

            if(secondPlayerName.toUpperCase() != secondPlayerName.toLowerCase())
                document.getElementById("p2text").innerText = secondPlayerName;

            prepareGame();

        });

        // When someone clicks the "x" button, the modal will be closed without any changes in the player names.
        //prepareGame function starts working and it prepares the game,background,pieces,texts
        $(".close").click(function(){
            $("#modalWindow").fadeOut();
            prepareGame();
        });

    });

function prepareGame() {
    //Used jQuery's "each" function to traverse all the array items (8row-columns) and therefore add elements with class 'row'  to the 'table' div.
    //row class is given to div, it will be later used to determine
    $.each([1,2,3,4,5,6,7,8], function(index, value) {
        $('.table').append('<div class="row r' + value + '"></div>'); //rows determined

        //To determine actual position, I added one more divs to each section. As a result, a table-like structure is created for the game to place the pieces
        $.each([1,2,3,4,5,6,7,8], function(index2, value2) {
            $('.row.r' + value).append('<div id="pos' + value + 'x' + value2 + '"></div>'); //actual position determined (example: 2x4)
        });
    });

    //assigned the entered names to variables to use in p1 and p2
    var name1 = document.getElementById("firstplayer").value;
    var name2 = document.getElementById("secondplayer").value;

    //created first player and the second player by assigning them id, names above and determined their color by using
    //the colors array. if the random generates number 0 => the color is red. if 1 is generated, then the color is black.
    var player_color = Math.floor (Math.random() * 2); // 0 or 1, will be used with colors array to determine index
    p1 = new Player(1, name1, colors[player_color]);
    player_color == 0? player_color=1: player_color=0;
    p2 = new Player(2, name2, colors[player_color]);


    //inserted into div spans made for player1 & player2 to locate pieces.
    //grouped first & third (for p2: sixth& eighth) rows because in these rows, the pieces are located on columns with even numbers.(2,4,6,8)
    //for the second(for p2: seventh) row, I searched for odd numbered columns and placed pieces on them. (1,3,5,7)
    //I determined the colors of pieces by assigning them classes named after the colors p1 and p2 objects have.
    //so a piece gets the class "piece" as a default and after that, it can have "black" or "red". I styled these class with css.

    //first player:
    $('.row.r1, .row.r3').find('div:odd').append('<span class="piece ' + p1.color + '"></span>');
    $('.row.r2').find('div:even').append('<span class="piece ' + p1.color + '"></span>');

    //second player:
    $('.row.r6, .row.r8').find('div:even').append('<span class="piece ' + p2.color + '"></span>');
    $('.row.r7').find('div:odd').append('<span class="piece ' + p2.color + '"></span>');

    //Deciding whose turn it is in the game.
    var whoPlays = Math.floor(Math.random() * 2 +1); //generates 1 or 2.
    current_player = whoPlays == 1?p1:p2; //if generated value is 1, then it is p1's turn. if 2, then p2's.

    //Above the game board, my game gives instructions about the game. At the start, the box shows the current player's name (if entered)
    //if the name is not entered, the current player's id shows up with a message.
    $('#messagePanel span').text('Hey, Player ' + current_player.id + '! click the piece you want to move.');

    //Check if the name entered contains a letter. If so, show the message with given name instead of id.
    if(current_player.name.toUpperCase() != current_player.name.toLowerCase())
        $('#messagePanel span').text('Hey, ' + current_player.name + '! click the piece you want to move.');

    //for each moveable item, 'move' class is added and this function makes movePiece function work, which actually changes the position of a piece.
    $(document).on('click', 'div.move', function(){
        movePiece($(this));
    });

    //A function that shows important messages throughout the game
    gameMessages();
}

function gameMessages(){
    //This command prevents players from continuously moving their pieces without taking turns
    //Every click action of each item on the game board is deleted with these methods.
    $('#game-board').find('*').prop("onclick", null).off("click");

    //if there aren't any active pieces, then focusPieces function works to determine whether there are
    //moves available etc. (explained further with function)
    if ($('span.piece.' + current_player.color + '.active').length == 0)
        focusPieces();

    // These are messages shown in messagePanel if a player doesn't click on pieces that can be moved

    //If the current player, clicks on a piece of the opponent, a message telling so will be displayed when one of the pieces is clicked.
    //Jquery selects the span composed of pieces, which aren't of the current player's color. Color of the player is also shown.
    $('span.piece:not(current_player.color)').on('click', function() {
        $('#messagePanel span').text('Focus! This is not your piece. Your color is ' + current_player.color +'.');
    });

    //When a player clicks on their own piece but there are no moves available for that one, then a message is also displayed.
    //After that, I use two functions. One adds special css for the pieces that can be moved and the other deletes the "move"
    //class that was given by clicking.
    $('span.piece.' + current_player.color + ':not(active)').on('click', function() {
        $('#messagePanel span').text('Choose one of the highlighted pieces, no  moves available for this one!');
        focusPieces();
        clearMoves();
    });

    //If a player clicks on one of the light squares, a message is displayed telling that these areas aren't used in the game.
    //to access all light squares, we have to find all squares located on odd rows and odd columns (oddxodd)
    //and also even rows and even columns.(evenxeven)
    $('.row:nth-child(odd) div:nth-child(odd), .row:nth-child(even) div:nth-child(even)').on('click', function(){
        $('#messagePanel span').text("Light squares aren't used.");
    });

    //When someone clicks on a piece that has moves available, the 'active' class is removed from it.
    // if another moveable piece had 'selected' class, which means that was clicked before, 'selected' class is deleted
    // from that piece and is assigned to the latest clicked active one. After that, a function calculates all possible
    //moves and displays a message that tells the player to move.

    $('span.piece.active').on('click', function() {
        $('span.piece.active').removeClass('active');
        $('span.piece.selected').removeClass('selected');
        clearMoves()
        $(this).addClass('selected');
        $('#messagePanel span').text('Now click the square you want to move to.');
        $.each(movesPossible($(this).parent().attr('id')), function(index, value) {
            $(value).addClass('move');
        });


        //this code checks the unavailable moves
        //checked the locations that have pieces on them. ( even row & odd column or odd row & even column)
        //if the position that i declared in the table is empty and if 'move' class wasn't added, then click is reseted.
        //new 'click' behavior is defined after that.
        //we assigned text messages to the text panel telling that this move can't be made. if someone clicks again
        //on a square that can't be moved, then notifications show up again.

        $('.row:nth-child(even) div:nth-child(odd), .row:nth-child(odd) div:nth-child(even)').filter(function() {
            return $(this).is(':empty') && !$(this).hasClass('move'); }).prop("onclick", null).off("click");
        $('.row:nth-child(even) div:nth-child(odd), .row:nth-child(odd) div:nth-child(even)').filter(function() {
            return $(this).is(':empty') && !$(this).hasClass('move'); }).on('click', function() {
            if ($('#messagePanel span').text() == "You can't move to this square.") {
                $('#messagePanel span').text("Can't move to this one either!");
            } else {
                $('#messagePanel span').text("You can't move to this square.");
            }
        });
    });
}

function movesPossible(pos) {
    //I got help from tutorials while writing this part.
    canMove = [1,2]; //created an array that shows which moves can be done
    positionsAvailable = []; //created another array which will store the positions that can be moved
    if ($('#'+pos).children().hasClass('king'))
        canMove = [1,2,-1,-2]; //this code checks if the piece has 'king' class, in other words, if it has reached the ending row of the opponent.
                               // if true, then the piece gets two more positions available to move (ability to move backwards)

    //here, we determine the current row and current column with getting the integer values of given variable
    current_row = parseInt(pos[3]);
    current_col = parseInt(pos[5]);

    //take index and value by which the piece will be moved and do the calculations before making any move
    $.each(canMove, function(index, value) {
        checkRow = value*(current_player.id == 1?1:-1) + current_row ;
        checkFirstCol = current_col - value;
        checkSecondCol = current_col + value;

        //each case checks whether the value that is assigned to checkRow and check..Col are greater than 1 and less than 8 (or equal)
        //then create the actual positions that are possible and push them to 'positionsAvailable' array. After that, return the values to be
        //used later. These items may get 'move' or 'active' classes according to the player's moves.
        switch (index) {
            case 0:
                if (is1x8(checkRow) && is1x8(checkFirstCol) && $('#pos' + checkRow + 'x' + checkFirstCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkFirstCol);
                if (is1x8(checkRow) && is1x8(checkSecondCol) && $('#pos' + checkRow + 'x' + checkSecondCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkSecondCol);
                break;
            case 1:
                if (is1x8(checkRow) && is1x8(checkFirstCol) && $('#pos' + (checkRow + (current_player.id == 1?-1:1)) + 'x' + (checkFirstCol + 1)).children().hasClass(current_player.color == 'red'?'black':'red') && $('#pos' + checkRow + 'x' + checkFirstCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkFirstCol);
                if (is1x8(checkRow) && is1x8(checkSecondCol) && $('#pos' + (checkRow + (current_player.id == 1?-1:1)) + 'x' + (checkSecondCol - 1)).children().hasClass(current_player.color == 'red'?'black':'red') && $('#pos' + checkRow + 'x' + checkSecondCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkSecondCol);
                break;
            case 2:
                if (is1x8(checkRow) && is1x8(checkFirstCol) && $('#pos' + checkRow + 'x' + checkFirstCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkFirstCol);
                if (is1x8(checkRow) && is1x8(checkSecondCol) && $('#pos' + checkRow + 'x' + checkSecondCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkSecondCol);
                break;
            case 3:
                if (is1x8(checkRow) && is1x8(checkFirstCol) && $('#pos' + (checkRow + (current_player.id == 1?1:-1)) + 'x' + (checkFirstCol - 1)).children().hasClass(current_player.color == 'red'?'black':'red') && $('#pos' + checkRow + 'x' + checkFirstCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkFirstCol);
                if (is1x8(checkRow) && is1x8(checkSecondCol) && $('#pos' + (checkRow + (current_player.id == 1?1:-1)) + 'x' + (checkSecondCol + 1)).children().hasClass(current_player.color == 'red'?'black':'red') && $('#pos' + checkRow + 'x' + checkSecondCol).is(':empty'))
                    positionsAvailable.push('#pos' + checkRow + 'x' + checkSecondCol);
                break;
        }
    });
    return positionsAvailable;
}

function is1x8(n) {
    return n >= 1 && n <= 8;
}

//this function checks if there are any possible moves for a piece and after that assigns the piece to 'active' class.
function focusPieces() {
    $('span.piece.' + current_player.color).each(function() {
        //we pass id attribute and current player's id to movesPossible function. it returns an array with possible ids. if there are no possible
        //moves ( length of array is 0, then the class 'selected' goes back to 'active'
        if (movesPossible($(this).parent().attr('id'), current_player.id).length > 0)
            $(this).removeClass('selected').addClass('active');
    });
    //if there are no active pieces for a player, then it means that the other player won.
    if ($('span.active').length == 0) setTimeout(function(){
        alert("Game over! Player" + (current_player.id) + "won.");}, 1000);
}

//when you click on a piece in order to move it, 'move' class is assigned to that piece.
//at some points, I had to delete this status to continue.
function clearMoves() {
    $('div.move').removeClass('move');
}

//An exact function to move pieces is needed
function movePiece(piece) {
    clearMoves();
    //if the difference between piece's index and selected piece's parent index is 2, then the piece should be removed
    //because when the player jumps over the piece of the opponent, then it should disappear.
    if (Math.abs(piece.index() - $('span.piece.selected').parent().index()) == 2)
        removePiece($('span.piece.selected').parent().attr('id'), piece.attr('id'));

    //if 1st player  reaches the 8th row, or 2nd player reaches the 1st row, then 'king' class is assigned to the piece that reached these rows.
    //in other words, when this happens a player reaches the last row of the opponent and gains the ability to move backwards. I gave style to
    // 'king' class with css.
    if ((piece.attr('id').indexOf('8x') >= 0 && current_player.id == 1) || (piece.attr('id').indexOf('1x') >= 0 && current_player.id == 2))
        $('span.piece.selected').addClass('king');

    //After that, 'selected' class is removed to clear the css that was given with that.
    piece.append($('span.piece.selected').removeClass('selected'));

    //On message panel, the location where the latest player has moved is displayed as soon as the current player changes.
    //First, I again check whether the current player's name contains letters or not.
    //if there is no readable name given, then the messages are displayed with ids.
    //id is the actual position in rowxcolumn format
    if(current_player.name.toUpperCase() != current_player.name.toLowerCase())
        $('#messagePanel span').text(current_player.name + ' moved to ' + piece.attr('id'));
    else
        $('#messagePanel span').text('Player' + current_player.id + ' moved to ' + piece.attr('id'));

    //message is shown
    setTimeout(function(){$('#messagePanel span').text('Click the piece you want to move.');}, 1000);

    //To change the player, I check the current id of the player and reassign the other id to the current_player variable again.
    //it is done after each move.
    current_player = current_player.id == 1?p2:p1;

    //to display the needed messages
    gameMessages();
}

//this function takes two variables that both are pieces' indexes. One is the piece of current player and the other one is of the opponent.
//it works when a piece jumps over another to remove the opponent's piece.
//I got help from tutorials while writing this part.
function removePiece(a, b) {
    var p = "#pos";
    //declaration of the player's direction is needed.
    //the third values in the index arrays must have a difference which is of negative value.
    var opposite_direction = (current_player.id == 1 ? parseInt(b[3]) - parseInt(a[3]) < 0 : parseInt(a[3]) - parseInt(b[3]) < 0);
    //after declaring that, the actual position is calculated considering the current player and the square position. (for example 4x3 form)
    if (!opposite_direction)
        p = p + (parseInt(b[3]) + (current_player.id == 1?-1:1)) + "x" + (parseInt(b[5]) > parseInt(a[5])?(parseInt(b[5]) - 1):(parseInt(b[5]) + 1));
    if (opposite_direction)
        p = p + (parseInt(b[3]) + (current_player.id == 1?1:-1)) + "x" + (parseInt(b[5]) > parseInt(a[5])?(parseInt(b[5]) - 1):(parseInt(b[5]) + 1));

    //clears the display of p
    $(p).html('');
}


