function Score() {

    var self = this;

    this._target = TargetKind.None;

    this._visualKeyPressed = false;

    this._hits = 0;              // pressed S correctly
    this._falseAlarms = 0;       // pressed S when no match
    this._missed = 0;            // did not press when match
    this._correctRejections = 0; // correctly did nothing

    this._trialCount = 0;

    this._targets = 0;

    this._reactionTimes = [];

    this._trialStartTime = 0;


    /* ---------- START TRIAL ---------- */

    this.startNewTrial = function(correctAnswer) {

        this._target = correctAnswer;

        this._visualKeyPressed = false;

        if(correctAnswer === TargetKind.Visual){
            this._targets++;
        }

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

            self._hits++;

        }
        else {

            handleTrialResult(TrialResult.Visual_Failure);

            self._falseAlarms++;

        }

    }


    /* ---------- END TRIAL ---------- */

    this.endTrial = function() {

        self._trialCount++;

        if(self._target === TargetKind.Visual && !self._visualKeyPressed) {

            self._missed++;

        }

        if(self._target !== TargetKind.Visual && !self._visualKeyPressed) {

            self._correctRejections++;

        }

        this._target = TargetKind.None;
        this._visualKeyPressed = false;

    }


    /* ---------- START BLOCK ---------- */

    this.startBlock = function() {

        this._hits = 0;
        this._falseAlarms = 0;
        this._missed = 0;
        this._correctRejections = 0;

        this._trialCount = 0;
        this._targets = 0;

        this._reactionTimes = [];

    }


    /* ---------- END BLOCK ---------- */

    this.endBlock = function() {

        return {
            totalTrials: this._trialCount,
            targets: this._targets,
            hits: this._hits,
            missed: this._missed,
            falseAlarms: this._falseAlarms,
            correctRejections: this._correctRejections,
            correctDecisions: this.getCorrectDecisions(),
            accuracy: this.getAccuracy(),
            meanReactionTime: this.getMeanReactionTime()
        };

    }


    /* ---------- TOTAL CORRECT DECISIONS ---------- */

    this.getCorrectDecisions = function(){

        return this._hits + this._correctRejections;

    }


    /* ---------- ACCURACY ---------- */

    this.getAccuracy = function() {

        if(this._trialCount === 0) return 0;

        var correct = this._hits + this._correctRejections;

        return ((correct / this._trialCount) * 100).toFixed(2);

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