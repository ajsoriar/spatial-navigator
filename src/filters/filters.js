var nav = nav || {};

nav.filters = {
    filtersFunctions:[],
    applyOrder:[],
    init: function(){
        // import filters from filters.lib.js
        this.import("default.filters.lib.js");
        this.import("trees.filters.lib.js");
    },
    createFilter: function(){

    },
    removeFilter: function(){

    },
    switchOnFilter: function(){

    },
    switchOffFilter: function(){

    },
    getFiltersList: function(){

    }
}

nav.filters.groups = [
    {
        id: 1,
        name: "directional",
        aplicationOrder: ["HALF","CONSTRAINT","DISTANCE"]
    },
    {
        id: 2,
        name: "poligonal",
        aplicationOrder: ["POLIGONAL","DISTANCE"]
    },
    {
        id: 3,
        name: "just-nearest",
        aplicationOrder: ["DISTANCE"]
    }
] 