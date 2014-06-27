var eKnights = require('../src/eKnightsData').eKnightsData;
var Repository = require('./Repository').Repository;



eKnights.forEach(function(eKnight) {

    eKnight.getMainRepository = function() {
        for (var i = 0; i < eKnight.repositories.length; i++) {
            if (eKnight.repositories[i].main === true)
                return new Repository(eKnight.repositories[i]);
        }
    };

});

module.exports.repositories = eKnights;

