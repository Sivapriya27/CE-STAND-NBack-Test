function BlockCreator() {

    const default_Block_Size = 20;
    const num_Blocks_Total = 20;
    const num_Visual_Targets = 8;

    this.GetDefaultBlockSize = function () {
        return default_Block_Size;
    }

    this.GetNumBlocksTotal = function () {
        return num_Blocks_Total;
    }

    this.createBlock = function (n) {

        var trials = [];
        var targets = this.getTargets();

        for (var i = 0; i < default_Block_Size; i++) {

            var position;

            // prevent first n trials from being targets
            if (i < n) {

                position = this.getRandomPosition(
                    trials.length > 0 ? trials[i - 1].GetPosition() : null
                );

                var t = new Trial(position);
                t.SetSecondTrialInTarget(TargetKind.TooEarly);

                trials.push(t);
                continue;
            }

            // check if this index should be a target
            var isTarget = targets.includes(i);

            if (isTarget) {

                var matchTrial = trials[i - n];

                var t = new Trial(matchTrial.GetPosition());
                t.SetSecondTrialInTarget(TargetKind.Visual);

                trials.push(t);

            } else {

                var previousPosition = trials[i - 1].GetPosition();
                var forbiddenPosition = trials[i - n].GetPosition();

                position = this.getRandomPosition(previousPosition, forbiddenPosition);

                var t = new Trial(position);
                t.SetSecondTrialInTarget(TargetKind.None);

                trials.push(t);
            }
        }

        return trials;
    }


    /* ---------- GENERATE TARGET INDEXES ---------- */

    this.getTargets = function () {

        var targets = [];

        while (targets.length < num_Visual_Targets) {

            var index = Math.floor(Math.random() * default_Block_Size);

            if (!targets.includes(index)) {
                targets.push(index);
            }
        }

        targets.sort(function (a, b) {
            return a - b;
        });

        return targets;
    }


    /* ---------- RANDOM POSITION ---------- */

    this.getRandomPosition = function (previousPosition, forbiddenPosition) {

        var pos;

        do {

            var rand = Math.floor(Math.random() * 8);
            pos = squarePositionIndexer(rand);

        }
        while (
            pos === previousPosition ||
            pos === forbiddenPosition
        );

        return pos;
    }

}



/* ---------- POSITION ENUM HELPER ---------- */

function squarePositionIndexer(i) {

    switch (i) {

        case 0: return SquarePosition.TopLeft;
        case 1: return SquarePosition.TopMiddle;
        case 2: return SquarePosition.TopRight;
        case 3: return SquarePosition.MiddleRight;
        case 4: return SquarePosition.BottomRight;
        case 5: return SquarePosition.BottomMiddle;
        case 6: return SquarePosition.BottomLeft;
        case 7: return SquarePosition.MiddleLeft;

    }

}