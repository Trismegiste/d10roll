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
            $('#dice-result').empty();
            $('#success-result').html('');
            $('#dice-result').addClass('loader');
            wod.roll10($('#dice-count').val());

            return false;
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
        } else {
            successView.removeClass('botched');
        }
        successView.html(successCount);
    },
    roll10: function (diceCount) {
        var res = [];

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
        });

        return res;
    }
};