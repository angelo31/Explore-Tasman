$(document).ready(function() {  
  getWeather(); //Get the initial weather.
  setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});

function getWeather() {
  $.simpleWeather({
    location: '',
    woeid: '2351310',
    zipcode: '',
	unit: 'c',
    success: function(weather) {
//      html = '<h2><i class="icon-'+weather.code+'"></i>'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
        html = '<ul><li>'+weather.city+weather.region+'</li>';
//      html += '<li class="currently">'+weather.currently+'</li>';
//      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
//      html += '<p>'+weather.updated+'</p>';
  
  for(var i=0;i<weather.forecast.length;i++) {
        html += '<li class="forcast">'+weather.forecast[i].day+': '+weather.forecast[i].high+'</li>';
      }
  
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}