angular.module("arrayUtill",[]).factory("arrayUtill",function(){var array_utill=function(){this.clusterNcount=function(resultSet,param){"use strict";resultSet.sort(function(a,b){var k1=a[param],k2=b[param];return k1>k2?1:k2>k1?-1:0});for(var counts=new Object,i=0;i<resultSet.length;i++)void 0===counts[resultSet[i].name]?counts[resultSet[i].name]=1:counts[resultSet[i].name]++;for(var i=0;i<resultSet.length;i++)for(;i<resultSet.length-1&&resultSet[i+1][param].toLowerCase()===resultSet[i][param].toLowerCase();)resultSet.splice(i,1);for(var i=0;i<resultSet.length;i++)resultSet[i].amount=counts[resultSet[i].name];return resultSet}};return new array_utill});