(function() {
    "use strict";

    var F = ['U', 'F', 'L', 'R', 'BL', 'BR'];
    var M = ['', "'", "2", "2'"];

    var faces = {
        "F": 0,
        "R": 1,
        "BR": 2,
        "BL": 3,
        "L": 4
    };

    function getMegaS2LScramble(type, length, cases) {
        var n = length || 48;
        var res = '';
        var prev_f = null;
        var dq = [];

        for (var i = 1; i <= n; i++) {
            var f = F[mathlib.rn(F.length)];

            if (dq.length >= 2) {
                while (
                    (
                        faces[f] !== undefined &&
                        faces[dq[dq.length - 2]] === faces[f] &&
                        (
                            ((faces[dq[dq.length - 1]] - faces[f] + 5) % 5) === 2 ||
                            ((faces[dq[dq.length - 1]] - faces[f] + 5) % 5) === 3
                        )
                    )
                    || f === prev_f
                ) {
                    f = F[mathlib.rn(F.length)];
                }

                if (faces[f] !== undefined) {
                    dq.push(f);
                    dq.shift();
                } else {
                    dq.shift();
                    dq.shift();
                }
            } else {
                while (f === prev_f) {
                    f = F[mathlib.rn(F.length)];
                }
                if (faces[f] !== undefined) {
                    dq.push(f);
                }
            }

            var m = M[mathlib.rn(M.length)];
            prev_f = f;

            // pad each move to width 4
            var a = f + m;
            a += " ".repeat(4 - a.length);

            // append moves to res
            if (i % 12 === 0) {
                // If last move, don't add newline
                if (i === n) {
                    res += " " + a + "\u200B"; // zero-width char ensures alignment of the last line
                } else {
                    res += " " + a + "\n";
                }
            } else {
                res += " " + a;
            }
        }

        return res;
    }

    // Register the scrambler
    scrMgr.reg('mgms2l', getMegaS2LScramble);

})();