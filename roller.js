wod = {
    init: function () {
        var diceCount = $('#dice-count');
        for (var k = 1; k <= 16; k++) {
            diceCount.append('<option value="' + k + '">' + k + 'd</option>')
        }

        var srList = $('#sr-list');
        for (var k = 3; k <= 10; k++) {
            srList.append('<option value="' + k + '">SR ' + k + '</option>')
        }
    },
    roller: function () {

    }
};