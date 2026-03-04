function Score() {

    var self = this;

    this._target = TargetKind.None;

    this._visualKeyPressed = false;

    this._score = 0;

    this._correct = 0;
    this._wrong = 0;
    this._missed = 0;

    this._trialCount = 0;

    this._reactionTimes = [];

    this._trialStartTime = 0;


    /* ---------- START TRIAL ---------- */

    this.startNewTrial = function(correctAnswer) {

        this._target = correctAnswer;

        this._visualKeyPressed = false;

        this._trialStartTime = performance.now();

    }


    /* ---------- RECORD RESPONSE ---------- */

    this.recordButtonPress = function(guess) {

        if(guess !== 's') return;

        if(self._visualKeyPressed === true) return;

        self._visualKeyPressed = true;

        var reactionTime = performance.now() - self._trialStartTime;

        self._reactionTimes.push(reactionTime);


        if(self._target === TargetKind.Visual) {

            handleTrialResult(TrialResult.Visual_Success);

            self._score += 1;
            self._correct += 1;

        }

        else {

            handleTrialResult(TrialResult.Visual_Failure);

            self._wrong += 1;

        }

    }



    /* ---------- END TRIAL ---------- */

    this.endTrial = function() {

        self._trialCount++;

        if(self._target === TargetKind.Visual && self._visualKeyPressed === false) {

            self._missed += 1;

        }

        handleScores(self._score);

        this._target = TargetKind.None;
        this._visualKeyPressed = false;

    }



    /* ---------- START BLOCK ---------- */

    this.startBlock = function() {

        this._score = 0;
        this._correct = 0;
        this._wrong = 0;
        this._missed = 0;

        this._trialCount = 0;

        this._reactionTimes = [];

    }



    /* ---------- END BLOCK ---------- */

    this.endBlock = function() {

        return {
            score: this._score,
            correct: this._correct,
            wrong: this._wrong,
            missed: this._missed,
            accuracy: this.getAccuracy(),
            meanReactionTime: this.getMeanReactionTime()
        };

    }



    /* ---------- ACCURACY ---------- */

    this.getAccuracy = function() {

        if(this._trialCount === 0) return 0;

        return ((this._correct / this._trialCount) * 100).toFixed(2);

    }



    /* ---------- MEAN REACTION TIME ---------- */

    this.getMeanReactionTime = function() {

        if(this._reactionTimes.length === 0) return 0;

        var sum = 0;

        this._reactionTimes.forEach(function(rt) {
            sum += rt;
        });

        return (sum / this._reactionTimes.length).toFixed(2);

    }

}