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
			getStatsSummoner(summonerId);
		});
	});

	function drawChartLastMatches(summonerId) {
		$.get(urlRiotApi + "v1.3/game/by-summoner/" + summonerId + "/recent?api_key=" + apiKey, function(response) {
			console.log(response);
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
			
			var tempI = 1;
			var data = [{},{},{},{},{}];
			for(var i = 1; i <= 5 ; i++) {
				data[i - 1].totalGamesPlayed = championsPlayed[i].stats.totalSessionsPlayed;
				data[i - 1].totalGamesLost = championsPlayed[i].stats.totalSessionsLost;
				data[i - 1].totalGamesWon = championsPlayed[i].stats.totalSessionsWon;
				$.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/" + championsPlayed[i].id + "?api_key=" + apiKey + "&champData=all", function(response) {
					data[tempI - 1].name = response.name;
					data[tempI - 1].img = "http://ddragon.leagueoflegends.com/cdn/6.13.1/img/champion/" + response.key + ".png";
					tempI++;
					if(tempI == 6) {
						drawChartMostPlayedChampions(data);
					}
				});
			}
		});
	}

	function getStatsSummoner(summonerId) {
		// /api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/summary
	}

	function drawChartMostPlayedChampions(data) {
		var chart = $('#chartMostPlayedChampions').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: [
	                data[0].name,
	                data[1].name,
	                data[2].name,
	                data[3].name,
	                data[4].name
	            ],
	            labels: {
                    color: '#fff',
                    x: 5,
                    useHTML: true,
                    formatter: function () {
                        var img = this.value.toLowerCase();
                        img = img.charAt(0).toUpperCase() + img.slice(1);
                        return '<img class="champion" src="http://ddragon.leagueoflegends.com/cdn/6.13.1/img/champion/' + img + '.png" />';
                    }
                },
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Number of games played'
	            }
	        },
	        legend: {
	            verticalAlign: 'top'	
	        },
	        tooltip: {
	            headerFormat: '<table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0,
	                verticalAlign: "top"
	            },
	        },
	        series: [{
	            name: 'Total of games played',
	            data: [data[0].totalGamesPlayed, data[1].totalGamesPlayed, data[2].totalGamesPlayed, data[3].totalGamesPlayed, data[4].totalGamesPlayed]
	        }, {
	            name: 'Games won',
	            data: [data[0].totalGamesWon, data[1].totalGamesWon, data[2].totalGamesWon, data[3].totalGamesWon, data[4].totalGamesWon]
	        }, {
	            name: 'Games lose',
	            data: [data[0].totalGamesLost, data[1].totalGamesLost, data[2].totalGamesLost, data[3].totalGamesLost, data[4].totalGamesLost]
	        }]
	    });
	}
});