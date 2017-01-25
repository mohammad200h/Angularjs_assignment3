(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('MenuCategoriesController', MenuCategoriesController)
.service('SearchService',SearchService)
.directive('foundItems',FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

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


  var didRunOnce = false;
  var removeBtnPressed = false;
  menu.searchTerm = "";
  menu.found = [];
  menu.test = "dickface"
  menu.lol= [];

  menu.filterData = function(searchTerm){
    menu.found = [];
    removeBtnPressed = false;
  if(searchTerm!="")  {

    var promise =SearchService.getMatchedMenuItems(searchTerm);
    promise.then(function(response){
      menu.found = response;
      console.log(menu.found);
      console.log(menu.found.length);
      if(menu.found.length ==0){
        didRunOnce = true;
      }
    });
  }else{
    didRunOnce =true;
    console.log(menu.found.length);
    console.log(didRunOnce);
  }




  };
  menu.removeItem  = function(index){
      menu.found.splice(index,1);
      removeBtnPressed = true;


  };
  menu.nothingFound= function(){
    if((menu.found.length == 0) && didRunOnce==true && removeBtnPressed == false){

      return true;

    }else {
      return false;
    }
    console.log(menu.found.length);
    console.log(menu.searchTerm);
  }



}

SearchService.$inject = ['$http', 'ApiBasePath'];
function SearchService($http, ApiBasePath){
  var service =this;

  service.getMatchedMenuItems = function(searchTerm){


    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (rawdata) {
      var filterData = [];
      var data = [];
      console.log(rawdata);
      data =  rawdata.data.menu_items.map(function(element){
        return element.description;
      });
      console.log(data);
      var index = 0;
      var counter = 0;

      data.forEach(function(element){
        if(element.includes(searchTerm)==1){
          filterData [counter] = rawdata.data.menu_items[index];
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
