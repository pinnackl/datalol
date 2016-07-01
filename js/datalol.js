$(document).ready(function() {
	var urlRiotApi = "https://euw.api.pvp.net/api/lol/euw/";
	var apiKey = "RGAPI-867226E0-C67A-4686-88B0-9F027A3D4CA8";

	document.getElementById("search-button").addEventListener("click", function() {
		var summonerName = document.getElementById("search-input").value.toLowerCase();
		summonerName = "alaixys";
		$.get(urlRiotApi + "v1.4/summoner/by-name/" + summonerName + "?api_key=" + apiKey, function(response) {
			var summonerId = response[summonerName].id;
			drawChartLastMatches(summonerId);
			getMostPlayedChampions(summonerId);
		});
	});

	function drawChartLastMatches(summonerId) {
		$.get(urlRiotApi + "v1.3/game/by-summoner/" + summonerId + "/recent?api_key=" + apiKey, function(response) {
			var lastGames = response.games,
				gamesWon = 0,
				gamesLose = 0;

			for(var i = 0; i < lastGames.length; i++) {
				if(lastGames[i].stats.win === true) {
					gamesWon += 1;
				} else {
					gamesLose += 1;
				}
			}

			var ctx = document.getElementById("chartRecentGames").getContext("2d");
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: ["Games lose", "Games won"],
			        datasets: [{
			            label: '# of games played',
			            data: [gamesWon, gamesLose],
			            backgroundColor: [
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(32, 79, 21, 0.2)'
			            ],
			            borderColor: [
			                'rgba(255,99,132,1)',
			                'rgba(32, 79, 21, 1)'
			            ],
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                },
			                scaleLabel: {
						      	display: true,
						      	labelString: 'Number of games played'
						    }
			            }]
			        }
			    }
			});
		});
	}

	function getMostPlayedChampions(summonerId) {
		$.get(urlRiotApi + "v1.3/stats/by-summoner/" + summonerId + "/ranked?api_key=" + apiKey, function(response) {
			var championsPlayed = response.champions;

			function compare(a, b) { 
				if (a.stats.totalSessionsPlayed > b.stats.totalSessionsPlayed) return -1; 
				if (a.stats.totalSessionsPlayed < b.stats.totalSessionsPlayed) return 1; 
				return 0; 
			} 
			championsPlayed.sort(compare);

			var idFirstChampion = championsPlayed[1].id,
				idSecondChampion = championsPlayed[2].id,
				idThirdChampion = championsPlayed[3].id;
			
			var tempI = 1;
			for(var i = 1; i <= 3 ; i++) {
				$.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/" + championsPlayed[i].id + "?api_key=" + apiKey + "&champData=all", function(response) {
					var championName = response.key;
					var img = document.createElement("img");
					img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/6.13.1/img/champion/" + championName + ".png");
					document.getElementById("champion-" + tempI).appendChild(img);
					tempI++;
				});
			}
		});
	}
});