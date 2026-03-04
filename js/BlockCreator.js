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

        var targets = this.getTargets();
        var trials = [];

        // first n trials cannot be targets
        for (var i = 0; i < n; i++) {
            var t = this.getRandomTrial();
            t.SetSecondTrialInTarget(TargetKind.TooEarly);
            trials.push(t);
        }

        for (var i = n; i < default_Block_Size + n; i++) {

            var trialToAdd = this.getRandomTrialNoMatch(trials[i - n]);

            var matchingKind = targets.find(function (el) {
                return el.Key === (i - n);
            });

            if (matchingKind !== undefined) {

                var trialAlreadyAdded = trials[i - n];

                trialToAdd.SetSecondTrialInTarget(TargetKind.Visual);

                trialToAdd.SetPosition(trialAlreadyAdded.GetPosition());
            }

            trials.push(trialToAdd);
        }

        return trials;
    }

    this.getTargets = function () {

        var targets = [];

        for (var i = 0; i < num_Visual_Targets; i++) {

            var iTargetLocation = this.getRandomTargetLocation(targets);

            var target = {};
            target.Key = iTargetLocation;
            target.Value = TargetKind.Visual;

            targets.push(target);
        }

        targets.sort(function (a, b) {
            return a.Key - b.Key;
        });

        return targets;
    }

    this.getRandomTargetLocation = function (targets) {

        var iLocation = 0;

        do {

            iLocation = Math.floor((Math.random() * default_Block_Size));

            var findElement = targets.find(function (el) {
                return el.Key === iLocation;
            });

            if (findElement === undefined) {
                break;
            }

        } while (true);

        return iLocation;
    }

    this.getRandomTrialNoMatch = function (noMatch) {

        var s;

        do {

            var rand = Math.floor((Math.random() * 8));

            s = squarePositionIndexer(rand);

            if (s != noMatch.GetPosition()) {
                break;
            }

        } while (true);

        var t = new Trial(s);

        return t;
    }

    this.getRandomTrial = function () {

        var rand = Math.floor((Math.random() * 8));

        var s = squarePositionIndexer(rand);

        var t = new Trial(s);

        return t;
    }

}


// enum helper

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