wod = {
    ajaxInProgress: false,
    init: function () {
        var diceCount = $('#dice-count');
        for (var k = 1; k <= 16; k++) {
            diceCount.append('<option value="' + k + '">' + k + 'd</option>')
        }
        diceCount.val('9');

        var srList = $('#sr-list');
        for (var k = 2; k <= 10; k++) {
            srList.append('<option value="' + k + '">TN ' + k + '</option>')
        }
        srList.val('6');

        $('button').click(function (e) {
            $('#dice-result').empty();
            $('#success-result').html('');
            $('#dice-result').addClass('loader');
            wod.roll10($('#dice-count').val());

            return false;
        });

        $('#stat-result button').click(function (e) {
            var rolling = 10000;
            var stat = wod.getStat(rolling, $('#dice-count').val(), $('#sr-list').val());
            var rowX = $('#stat-result table thead tr');
            var rowY = $('#stat-result table tbody tr');
            rowX.empty();
            rowY.empty();
            stat.forEach(function (y, x) {
                rowX.append('<td>' + (x - 1) + '</td>');
                rowY.append('<td>' + Math.round(y / rolling * 100) + '%</td>');
            });

        });
    },
    updateView: function (rolledDice) {
        var sr = $('#sr-list').val();

        var diceResult = $('#dice-result');
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

        $('#dice-result').removeClass('loader');

        var successView = $('#success-result');
        if (successCount < 0) {
            successView.addClass('botched');
            successCount = "botch";
        } else {
            successView.removeClass('botched');
        }
        successView.html(successCount);
    },
    roll10: function (diceCount) {
        var res = [];

        if (this.ajaxInProgress) {
            return;
        }
        this.ajaxInProgress = true;

        $.ajax({
            url: 'https://www.random.org/integers/?num='
                    + diceCount
                    + '&min=1&max=10&col='
                    + diceCount
                    + '&base=10&format=plain&rnd=new',
            method: 'GET'
        }).done(function (data) {
            var extracted = data.split("\t");
            for (var k = 0; k < diceCount; k++) {
                res[k] = parseInt(extracted[k]);
            }

            wod.updateView(res);
        }).fail(function (data) {
            alert('An error has occured');
        }).always(function () {
            wod.ajaxInProgress = false;
        });


        return res;
    },
    getStat: function (nbRoll, numDice, targetNumber) {
        var counter = [];
        for (var n = 0; n < nbRoll; n++) {
            var res = wod.rollPool(10, numDice, targetNumber);
            if (res < 0) {
                res = 0;
            } else {
                res++;
            }

            if (undefined === counter[res]) {
                counter[res] = 1;
            } else {
                counter[res]++;
            }
        }

        return counter;
    },
    rollDice: function (n) {
        return 1 + Math.floor(Math.random() * n);
    },
    rollPool: function (face, num, target) {
        var successCount = 0;

        for (var k = 0; k < num; k++) {
            var die = wod.rollDice(face);
            if (die === 1) {
                successCount--;
            } else if (die >= target) {
                successCount++;
                if (die === face) {
                    successCount++;
                }
            }
        }

        return successCount;
    }
};