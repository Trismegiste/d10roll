wod = {
    init: function () {
        var diceCount = $('#dice-count');
        for (var k = 1; k <= 16; k++) {
            diceCount.append('<option value="' + k + '">' + k + 'd</option>')
        }
        diceCount.val('9');

        var srList = $('#sr-list');
        for (var k = 2; k <= 10; k++) {
            srList.append('<option value="' + k + '">SR ' + k + '</option>')
        }
        srList.val('6');

        $('button').click(function (e) {
            var diceCount = $('#dice-count').val();
            var rolledDice = wod.localRoll10(diceCount);

            wod.roller(rolledDice);
            return false;
        });
    },
    roller: function (rolledDice) {
        var sr = $('#sr-list').val();

        var diceResult = $('#dice-result');
        diceResult.empty();
        var successCount = 0;

        rolledDice.forEach(function (die, idx) {
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
        });

        var successView = $('#success-result');
        if (successCount < 0) {
            successView.addClass('botched');
        } else {
            successView.removeClass('botched');
        }
        successView.html(successCount);
    },
    localRoll10: function (diceCount) {
        var res = [];
        for (var k = 0; k < diceCount; k++) {
            res[k] = 1 + Math.floor(10 * Math.random());
        }

        return res;
    },
    roll10: function (diceCount) {
        var res = [];

        $.ajax({
            url: 'https://www.random.org/integers/?num='
                    + diceCount
                    + '&min=1&max=10&col=1&base=10&format=plain&rnd=new',
            method: 'GET'
        }).done(function (data) {
            res = data.split("\n");
        }).fail(function (data) {
            alert(data);
        });

        return res;
    }
};