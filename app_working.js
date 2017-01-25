(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('MenuCategoriesController', MenuCategoriesController)
.service('SearchService',SearchService)
.directive('foundItems',FoundItems)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");

function FoundItems(){
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '=filterData',
      onRemove: '&'
    },
    controller:foundItemsDirectiveController,
    bindToController:true,
    controllerAs:'FIC'
  };

  return ddo;
}

function foundItemsDirectiveController(){
  var FIC = this;


}

MenuCategoriesController.$inject = ['SearchService'];
function MenuCategoriesController(SearchService) {
  var menu = this;

  menu.searchTerm = "";
  menu.found = [];
  menu.test = "dickface"
  menu.lol= [];

  menu.filterData = function(searchTerm){
   var promise =SearchService.getMatchedMenuItems(searchTerm);
   promise.then(function(response){
     menu.found = response;
     console.log(menu.found);
   });



  };
  menu.removeItem  = function(index){
      menu.found.splice(index,1);

  };



}

SearchService.$inject = ['$http', 'ApiBasePath'];
function SearchService($http, ApiBasePath){
  var service =this;

  service.getMatchedMenuItems = function(searchTerm){


    return $http({
      method: "GET",
      url: (ApiBasePath + "/categories.json")
    }).then(function (rawdata) {
      var filterData = [];
      var data = [];
      console.log(rawdata);
      data =  rawdata.data.map(function(element){
        return element.name;
      });
      //console.log(data);
      var index = 0;
      var counter = 0;

      data.forEach(function(element){
        if(element.includes(searchTerm)==1){
          filterData [counter] = rawdata.data[index];
          counter++;
        }
        index++;

      });
      //console.log(filterData);
      return filterData;
    });

  }
}

})();
