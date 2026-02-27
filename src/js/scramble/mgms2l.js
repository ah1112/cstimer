(function() {
    "use strict";

	// In order to scramble just S2L we can hold gray/black top and do only the moves adjacent to the top face
    var F = ['U', 'F', 'L', 'R', 'BL', 'BR'];
	// Once we fix a face to move, we can choose from four variants:
    var M = ['', "'", "2", "2'"];
	// This variable is defined so that later on we can pick a different move to generate if we do redundant moves involving non-adjacent faces
	// like L and R. So we wouldn´t  want something like L R L' to show up in the scramble.
    var faces = {
        "F": 0,
        "R": 1,
        "BR": 2,
        "BL": 3,
        "L": 4
    };

    function getMegaS2LScramble(_, length) {
		// Default number of moves is chosen to be 48
        var n = length || 48;
        var res = '';
        var prev_f = null;
        var dq = [];

        for (var i = 1; i <= n; i++) {
			// First we pick which face to turn
            var f = F[mathlib.rn(F.length)];

			// Here we avoid either consecutive moves of the same face or sequences of 3 moves like R L R'.
            if (dq.length >= 2) {
                while (
                    (
                        faces[dq[dq.length - 2]] === faces[f] &&
                        (
							// Faces that are not adjacent on mega S2L are either 2 or 3 mod 5 apart from each other, hence the following logic
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
				// We don't want two consecutive moves with the same face, so we keep generating until we get something different.
                while (f === prev_f) {
                    f = F[mathlib.rn(F.length)];
                }
                if (faces[f] !== undefined) {
                    dq.push(f);
                }
            }

			// Then we pick which move to do with that face
            var m = M[mathlib.rn(M.length)];
            prev_f = f;

            // Pad each move to width 4 so that it is nice to read on cstimer (like carrot style for instace)
            var a = f + m;
            a += " ".repeat(4 - a.length);

            // Append moves to res, creating blocks of 12 moves for easier reading
            if (i % 12 === 0) {
                // If last move, don't add newline
                if (i === n) {
                    res += " " + a + "\u200B"; // Zero-width char ensures alignment of the last line of the scramble
                } else {
                    res += " " + a + "\n";
                }
            } else {
                res += " " + a;
            }
        }

        return res;
    }

    // Register the scrambler. Corresponding line has to be added to index.php, the language files (like en-us.js) and tools.js (this one is so that the scrambles can be drawn and rendered under the "draw scramble" function).
    scrMgr.reg('mgms2l', getMegaS2LScramble);

})();