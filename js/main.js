
var SLOT = (function(){
	var clear_interval;
	// symbol code and styles
	var symbols = [{
		style : "symbol_spades", 
		code : "&#9824;"
	}, 
	{
		style : "symbol_clover",
		code : "&#9827;"
	},
	{
		style : "symbol_heart",
		code : "&#9829;"
	},
	{
		style : "symbol_diamont",
		code : "&#9830;"
	},
	{
		style : "symbol_crown",
		code : "&#9813;"
	},
	{
		style : "symbol_dollar",
		code : "&#36;"
	}];

	// Show items - five items for array
	var rollers = [
		[],
		[],
		[],
		[],
		[],
	];

	// Remove last item from roller
	var _removeLastItem = function(){
		// array.pop()
		//console.log('_removeItem');
		$.each( rollers, function( i, roller ){
			roller.pop();
		});
		// remove item from DOM
		/* $( ".col" ).each(function( index ,item ) {
			var last_item = $(item).find('.item').last();
			$(last_item).remove();
		}); */
		_animateSlot();
	};
	// Add new item to roller
	var _addFirstItem = function(){
		//a.unshift()
		//console.log('_addItem');
		$.each( rollers, function( i, roller ){
			i = i + 1;
			roller.unshift(_randomFigure());
			/* var first_item = roller[0];
			$('.js-col-'+ i).prepend('<div class="item ' + first_item.style  + ' js-item">' + first_item.code + '</div>'); */
		});
		
		_removeLastItem();
	};
	// Repeat _initSlot to set new data
	var _animateSlot = function(){
		// Delete itens from roller in DOM
		$( ".col" ).each(function( index ,item ) {
			$(item).find('.item').remove();
		});
		// init slot with new data
		_initSlot();
		/* var items_slot = $('.js-item');
		items_slot.animate({
			top: "+=100",
		}, 900, function() {
			_removeLastItem();
		}); */
	};
	// loop for control move slot
	var _loop = function(){
		//console.log('_loop');
		_addFirstItem();

	};
	// create new symbok from array symbols
	var _randomFigure = function(){
		var random_number = Math.floor(Math.random() * 6);
		return symbols[random_number];
	};
	// set data before init game
	var _setData = function(){
		$.each( rollers, function( i, roller ){
			//Only five elements for roller
			for (let index = 0; index < 5; index++) {
				roller.push(_randomFigure());
			}
		});
		//console.log('rollers', rollers);
		// Pintarlas en dom - cinco columnas con cinco elementos cada una
		_initSlot();
	};
	// Create elements in DOM
	var _initSlot = function(){
		//console.log('_initSlot');
		var slot = $('.js-visor-slot');
		/**
		 * template
		 * <div class="col col-1">
				<div class="item">1</div>
				<div class="item">2</div>
				<div class="item">3</div>
				<div class="item">4</div>
				<div class="item">5</div>
			</div>
		 */
		$.each( rollers, function( i, roller ){
			i = i + 1;
			var template = '<div class="col col-'+ i +' js-col-'+ i +'">';
			$.each( roller, function( j, item ){
				template = template + '<div class="item ' + item.style  + ' js-item">' + item.code + '</div>';
			});
			//slot.append("<div class='symbols "+ item.style +"'>"+ item.code + "</div>");
			slot.append(template);
		});
	};
	var init = function(){
		//console.log('_init');
		_setData();
		
	};
	
	// Functions Extenal button
	var startSlot = function (){
		clear_interval = window.setInterval(_loop,200);
		//console.log('startSlot');
	};
	var stopSlot = function (){
		window.clearInterval(clear_interval);
		//console.log('stopSlot');
		_checkPlay();
	};
	
	// Check play result
	var _checkPlay = function(){
		var result_game = [];
		var last_code , actual_code;
		var counter = 1;
		var code_winner,counter_winner;
		$.each( rollers, function( i, roller ){
			// save intermedian element(index 2) in roller array
			result_game.push(roller[2]);
		});
		//console.log('result_game',result_game);
		$.each( result_game, function( j, item ){
			if(last_code === item.code){
				counter = counter + 1;
				if(counter >= 3){
					code_winner = item.code;
					counter_winner = counter;
				}
			} else {
				counter = 1;
			}
			last_code = item.code;
		});
		
		//console.log('WINNER: ',code_winner,counter_winner);
		_savePlay(result_game,code_winner,counter_winner);
	};

	// Save play for historic game
	var _savePlay = function(game,code_winner,counter_winner){
		var result = [{
			date : _getDate(code_winner,counter_winner),
			prize : _getPrizes(code_winner,counter_winner),
			data : game
		}];
		
		//Set Prize play
		var result_prize = result[0].prize;
		var prize_title = $('.js-show-prize-title');
		$('.js-prize').text(result_prize);
		if(result_prize > 0 ){
			prize_title.text('Enhorabuena!! Acaba de ganar:'+  result_prize + " €");
		} else {
			prize_title.text('');
		}
		
		var historic = LocalStorageDataApi.getDataLocalStorage('historic') || [];
		historic.push(result);
		LocalStorageDataApi.setDataLocalStorage('historic',historic);
	};
	// get historic plays
	var getHistoric = function(){
		var historic = LocalStorageDataApi.getDataLocalStorage('historic');
		//console.log('historic ',historic);
		var template = "<div>";
		var target_historic = $('.js-historic');
		$.each( historic, function( i, element ){
			$.each( element, function( j, item ){
				template = template + "<h6 class='date-text'> Date: " + item.date + "</h6>";
				var item_style = " highlight-text ";
				if(parseInt(item.prize) > 0){
					item_style = " highlight-text-winner ";
				}
				template = template + "<h6 class='" + item_style + "'>Prize: " + item.prize + " €</h6>";
				$.each( item.data, function( k, data ){
					template = template + "<span class='little-item " + data.style  + "'>" + data.code + "</span>";
				});

			});
		}); 
		template = template + "</div>";
		target_historic.html(template);
	};
	// Get elementary date
	var _getDate = function(){  
		return new Date().toLocaleString();
	};

	var _getPrizes = function(code_winner,counter_winner){
		console.log('typeof', typeof code_winner ,typeof counter_winner);
		if(typeof code_winner === 'undefined' || typeof counter_winner === 'undefined'){
			return 0;
		} else {
			/*
				style : "symbol_spades", code : "&#9824;"
				style : "symbol_clover",code : "&#9827;"
				style : "symbol_heart",code : "&#9829;"
				style : "symbol_diamont",code : "&#9830;"
				style : "symbol_crown",code : "&#9813;"
				style : "symbol_dollar",code : "&#36;"
			*/
			
			switch (code_winner) {
				case "&#9824;":
				
				return _getPrizesLow(counter_winner);
					
				break;
				case "&#9827;":
				return _getPrizesLow(counter_winner);
					
				break;
				case "&#9829;":
				return _getPrizesLow(counter_winner);
					
				break;
				case "&#9830;":
				return _getPrizesLow(counter_winner);
					
				break;
				case "&#9813;":
				return _getPrizesMedium(counter_winner);
					
				break;
				// Dolar sign
				default:
				return _getPrizesHigh(counter_winner);
					break;
			}
		}
	};
	//Optimizar esta parte de los premios
	var _getPrizesLow = function(counter_winner){
		var prize;
		switch (counter_winner) {
			case 5:
				prize = 100;
			break;
			case 4:
			prize = 50;
			break;
			// Deafult 3
			default:
			prize = 25;
				break;
		}
		return prize;
	};
	var _getPrizesMedium = function(counter_winner){
		var prize;
		switch (counter_winner) {
			case 5:
				prize = 500;
			break;
			case 4:
			prize = 200;
			break;
			// Deafult 3
			default:
			prize = 100;
				break;
		}
		return prize;
	};
	var _getPrizesHigh = function(counter_winner){
		var prize;
		switch (counter_winner) {
			case 5:
				prize = 10000;
			break;
			case 4:
			prize = 2000;
			break;
			// Deafult 3
			default:
			prize = 1000;
				break;
		}
		return prize;
	};
	return {
		init		: init,
		startSlot	: startSlot,
		stopSlot	: stopSlot,
		getHistoric	: getHistoric
	};
}());

// Data store
var LocalStorageDataApi = (function(){

    var getDataLocalStorage = function(item){
        window[item] = localStorage.getItem(item) ? JSON.parse(localStorage.getItem(item)) : window[item] ;
        return window[item];
    };
    var setDataLocalStorage = function(item,data){
        //localStorage.clear();
        localStorage.setItem(item, JSON.stringify(data));
    };
    return {
        getDataLocalStorage     : getDataLocalStorage,
        setDataLocalStorage     : setDataLocalStorage
    };
    
})();

$(function(){ 
	SLOT.init();
	// Event for button actions in slot
	$('.js-wrapper-actions').on('click','.js-button',function(e){
		var this_button = $( event.target );
		var state = this_button.data('state');
		var text_state;
		if(state === 'start'){
			text_state = 'stop';
			SLOT.startSlot();
		} else {
			text_state = 'start';
			SLOT.stopSlot();
		}
		this_button.text(text_state);
		this_button.data('state',text_state);
	});
	// Evento for get historic
	$('.js-wrapper-actions').on('click','.js-get-historic',function(e){
		var this_button = $( event.target );
		SLOT.getHistoric();
	});
	// Evento for remove historic from localStorage and DOM
	$('.js-wrapper-actions').on('click','.js-remove-historic',function(e){
		localStorage.removeItem('historic');
		window['historic'] = '';
		// remove DOM historic
		var target_historic = $('.js-historic');
		target_historic.html("");
	});
});
