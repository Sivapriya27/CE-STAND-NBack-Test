function Page() {

    const _stimulus_time = 500;
    const _total_trial_time = 3000;

    var self = this;

    var startButton = document.getElementById('start-button');
    var continueButton = document.getElementById('continue-button');

    this.blockCreator = new BlockCreator();

    this.m_Trials = [];

    this._blockNum = 0;
    this._trialNum = 0;

    this._starting_N = 1;
    this._n = 1;

    this._score = new Score();

    this._playingGame = false;

    this.Timer_1;
    this.TrialTimer;

    DisplayN(this._starting_N);
    setProgress(0);


    /* ---------- START BUTTON ---------- */

    startButton.addEventListener('click', function(event) {

        if(event.target.value === "Start") {

            event.target.value = "Pause";
            event.target.textContent = "Pause";

            self.Start_Training();

        } 
        else if(event.target.value === "Pause") {

            event.target.value = "Resume";
            event.target.textContent = "Resume";

            self.Timer_1.pause();
            self.TrialTimer.pause();

        } 
        else if(event.target.value === "Resume") {

            event.target.value = "Pause";
            event.target.textContent = "Pause";

            self.Timer_1.resume();
            self.TrialTimer.resume();
        }

    });



    /* ---------- KEYBOARD INPUT ---------- */

    document.addEventListener("keyup", function(event) {

        if(self._playingGame !== true) return;

        if(event.key.toLowerCase() === "s") {

            self._score.recordButtonPress('s');

        }

    });



    /* ---------- START TRAINING ---------- */

    this.Start_Training = function() {

        self._playingGame = true;

        self._n = parseInt(document.getElementById("level-select").value);

        self._blockNum = 0;
        self._trialNum = 0;

        self.m_Trials = self.blockCreator.createBlock(self._n);

        self._score.startBlock();
        self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);

        self._score.startNewTrial(
            self.m_Trials[self._trialNum].GetSecondTrialInTarget()
        );

        self.Timer_1 = new Timer(self.hideStimulus, _stimulus_time);
        self.TrialTimer = new Timer(self.trialTimeUp, _total_trial_time);

    }



    /* ---------- HIDE STIMULUS ---------- */

    this.hideStimulus = function() {

        const cells = document.querySelectorAll(".cell");

        cells.forEach(c => {
            c.style.backgroundColor = "";
        });

    }



    /* ---------- TRIAL END ---------- */

    this.trialTimeUp = function() {

        self._score.endTrial();

        handleScores(self._score._score);

        self._trialNum++;

        document.getElementById("left-hand-feedback").style.backgroundColor = "";

        var progress = self._trialNum / self.m_Trials.length;
        setProgress(progress * 100);


       if(self._trialNum >= self.m_Trials.length) {

    var results = self._score.endBlock();

    document.getElementById("next-level-info").innerHTML =
        "Session complete";

    document.getElementById("correct-visual-results").innerHTML =
        "Score: " + results.score + " / 20 <br>" +
        "Correct: " + results.correct + "<br>" +
        "Wrong responses: " + results.wrong + "<br>" +
        "Missed targets: " + results.missed + "<br>" +
        "Accuracy: " + results.accuracy + "%<br>" +
        "Mean Reaction Time: " + results.meanReactionTime + " ms";

    $('#scoreModal').modal('show');

    return;
}


        self._score.startNewTrial(
            self.m_Trials[self._trialNum].GetSecondTrialInTarget()
        );

        self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);

        self.Timer_1 = new Timer(self.hideStimulus, _stimulus_time);
        self.TrialTimer = new Timer(self.trialTimeUp, _total_trial_time);

    }



    /* ---------- DISPLAY SQUARE ---------- */

    this.presentTrialInfoToUser = function(t) {

        const color = "#FFA500";

        switch(t.GetPosition()) {

            case SquarePosition.BottomLeft:
                document.getElementById("bottom-left").style.backgroundColor = color;
                break;

            case SquarePosition.BottomMiddle:
                document.getElementById("bottom-middle").style.backgroundColor = color;
                break;

            case SquarePosition.BottomRight:
                document.getElementById("bottom-right").style.backgroundColor = color;
                break;

            case SquarePosition.MiddleLeft:
                document.getElementById("middle-left").style.backgroundColor = color;
                break;

            case SquarePosition.MiddleRight:
                document.getElementById("middle-right").style.backgroundColor = color;
                break;

            case SquarePosition.TopLeft:
                document.getElementById("top-left").style.backgroundColor = color;
                break;

            case SquarePosition.TopMiddle:
                document.getElementById("top-middle").style.backgroundColor = color;
                break;

            case SquarePosition.TopRight:
                document.getElementById("top-right").style.backgroundColor = color;
                break;

        }

    }

}



/* ---------- SCORE DISPLAY ---------- */

function handleScores(totalScore) {

    document.getElementById("score-text").innerHTML = totalScore;

}



/* ---------- RESPONSE FEEDBACK ---------- */

function handleTrialResult(result) {

    var feedback = document.getElementById("left-hand-feedback");

    if(result === TrialResult.Visual_Success) {

        feedback.style.backgroundColor = "green";

        document.querySelectorAll(".cell").forEach(c=>{
            if(c.style.backgroundColor !== ""){
                c.style.backgroundColor = "green";
            }
        });

    }

    else if(result === TrialResult.Visual_Failure) {

        feedback.style.backgroundColor = "red";

    }

}



/* ---------- DISPLAY N LEVEL ---------- */

function DisplayN(n) {

    for(let i=1;i<=7;i++){

        let el=document.getElementById("N"+i);

        if(el) el.style.display="none";

    }

    for(let i=1;i<=n && i<=7;i++){

        let el=document.getElementById("N"+i);

        if(el) el.style.display="inline-block";

    }

}



/* ---------- PROGRESS BAR ---------- */

function setProgress(prog) {

    if(prog < 0 || prog > 100) return;

    document.getElementById("prog-bar").style.width = prog + "%";

}



/* ---------- TIMER ---------- */

function Timer(callback, delay) {

    var timerId;
    var start;
    var remaining = delay;

    this.pause = function() {

        clearTimeout(timerId);

        remaining -= new Date() - start;

    };

    this.resume = function() {

        start = new Date();

        clearTimeout(timerId);

        timerId = setTimeout(callback, remaining);

    };

    this.resume();

}