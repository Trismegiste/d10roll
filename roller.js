wod = {
    init: function () {
        var diceCount = $('#dice-count');
        for (var k = 1; k <= 16; k++) {
            diceCount.append('<option value="' + k + '">' + k + 'd</option>')
        }

        var srList = $('#sr-list');
        for (var k = 2; k <= 10; k++) {
            srList.append('<option value="' + k + '">SR ' + k + '</option>')
        }

        $('button').click(function (e) {
            wod.roller();
            return false;
        });
    },
    roller: function () {
        var diceCount = $('#dice-count').val();
        var sr = $('#sr-list').val();

        var diceResult = $('#dice-result');
        diceResult.empty();
        var successCount = 0;
        for (var k = 0; k < diceCount; k++) {
            var die = this.roll10();
            diceResult.append('<div class="pure-u-1-2">' + die + '</div>');
            // one
            if (die === 1) {
                successCount--;
            } else if (die >= sr) {
                successCount++;
                if (die === 10) {
                    successCount++;
                }
            }
        }

        var successView = $('#success-result');
        if (successCount < 0) {
            successView.addClass('botched');
        } else {
            successView.removeClass('botched');
        }
        successView.html(successCount);
    },
    roll10: function () {
        return 1 + Math.floor(10 * Math.random());
    }
};