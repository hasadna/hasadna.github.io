function indexCtrl($scope,$window,$http,timeUtill){function addLastUpdateProperty(updatedData){function updateByRepoUrl(i){if(-1!==i){var request=$http({method:"GET",url:unknownLastUpdate[i].mainRepo.getGithubApiUrl()});request.success(function(data){unknownLastUpdate[i].lastUpdate=data.pushed_at}),updateByRepoUrl(--index)}}if($scope.eKnights=$window.eKnightsData,$scope.eKnights.forEach(function(eKnight){for(var i=0;i<eKnight.repositories.length;i++)if(eKnight.repositories[i].main===!0){eKnight.mainRepo=new Repository(eKnight.repositories[i]);break}for(var url=eKnight.github_repo.toLowerCase(),i=0;i<updatedData.length;i++)updatedData[i].html_url.toLowerCase()===url&&(eKnight.lastUpdate=updatedData[i].pushed_at);eKnight.lastUpdate||unknownLastUpdate.push(eKnight)}),0!==unknownLastUpdate.length){var index=unknownLastUpdate.length-1;updateByRepoUrl(index),$scope.oldReposExists=!1;var today=new Date,threeMonthsInDays=90;$scope.eKnights.forEach(function(eKnight){var diff=timeUtill.dayDiff(new Date(eKnight.lastUpdate),today);diff>threeMonthsInDays&&($scope.oldReposExists=!0)})}$scope.small_repos=$window.small_repos}$scope.relativizePath=$window.CONFIG.relativizePath;var unknownLastUpdate=[],request=$http({method:"GET",url:"https://api.github.com/orgs/hasadna/repos?type=all"});request.success(addLastUpdateProperty)}App.controller("indexCtrl",indexCtrl);