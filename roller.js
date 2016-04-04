roller = {
    ajaxInProgress: false,
    maxDiceNumber: 18,
    init: function () {
        var diceCount = $('#dice-count');
        for (var k = 1; k <= this.maxDiceNumber; k++) {
            diceCount.append('<option value="' + k + '">' + k + 'd</option>')
        }
        diceCount.val('9');

        var srList = $('#sr-list');
        for (var k = 3; k <= 10; k++) {
            srList.append('<option value="' + k + '">tn' + k + '</option>')
        }
        srList.val('6');

        $('button').click(function (e) {
            var poolView = $('#dice-result');
            poolView.empty();
            poolView.addClass('loader');
            $('#success-result').html('');

            roller.localRoll10($('#dice-count').val()).then(function (pool) {
                roller.updateView(pool);
            }).catch(function (err) {
                alert(err.message);
            }).then(function () {
                poolView.removeClass('loader');
            });

            return false;
        });
    },
    updateView: function (rolledDice) {
        var sr = $('#sr-list').val();

        var diceResult = $('#dice-result');
        var successCount = 0;

        // updating pool view and counting...
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

        // updating roll result
        var successView = $('#success-result');
        if (successCount === 0) {
            successView.html('<div class="fail">FAIL</div>');
        } else if (successCount < 0) {
            successView.html('<div class="fail botched">BOTCH</div>');
        } else {
            successView.html('<div class="success">' + successCount + '</div><div class="small-legend">success</div>');
        }

        // updating history listing
        $('#history').prepend('<div class="pure-u-1-2 history-item">'
                + '<div class="pure-g">'
                + '<button class="pure-u-2-3 pure-button" data-history-rolled="'
                + rolledDice.length + '" data-history-tn="' + sr + '">'
                + rolledDice.length + 'd tn' + sr + '</button>'
                + '<div class="pure-u-1-3 old-result">' + successCount + '</div>'
                + '</div>'
                + '</div>');
        $('#history .history-item:eq(6)').remove();
    },
    roll10: function (diceCount) {
        return new Promise(function (resolve, reject) {
            var res = [];

            if (roller.ajaxInProgress) {
                return;
            }
            roller.ajaxInProgress = true;

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
                resolve(res);
            }).fail(function (data) {
                reject(Error('An error has occured'));
            }).always(function () {
                roller.ajaxInProgress = false;
            })
        });
    },
    localRoll10: function (diceCount) {
        return new Promise(function (resolve, reject) {
            var res = [];
            for (var k = 0; k < diceCount; k++) {
                res[k] = 1 + Math.floor(10 * Math.random());
            }

            resolve(res);
        })
    }

};